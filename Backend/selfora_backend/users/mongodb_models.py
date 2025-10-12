try:
    from pymongo import MongoClient
    from django.conf import settings
    import datetime
    from bson import ObjectId
    import json
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False
    print("Warning: pymongo not installed. MongoDB features will be disabled.")

if MONGODB_AVAILABLE:
    class MongoDBConnection:
        _instance = None
        _client = None
        _db = None

        def __new__(cls):
            if cls._instance is None:
                cls._instance = super(MongoDBConnection, cls).__new__(cls)
            return cls._instance

        def __init__(self):
            if self._client is None:
                try:
                    # MongoDB connection string - add to your settings
                    self._client = MongoClient('mongodb://localhost:27017/')
                    self._db = self._client['selfora_db']
                except Exception as e:
                    print(f"MongoDB connection failed: {e}")
                    self._db = None

        @property
        def db(self):
            return self._db

        @property
        def templates(self):
            return self._db.notion_templates if self._db else None

        @property
        def user_documents(self):
            return self._db.user_documents if self._db else None


    class NotionTemplate:
        """Notion-like template model for MongoDB"""
        
        def __init__(self, db_connection=None):
            self.db = db_connection or MongoDBConnection()
            self.collection = self.db.templates if self.db.db else None

        def create_template(self, template_data):
            """Create a new Notion-like template"""
            if not self.collection:
                raise Exception("MongoDB not available")
                
            template = {
                'name': template_data.get('name'),
                'type': template_data.get('type'),
                'description': template_data.get('description', ''),
                'icon': template_data.get('icon', '📄'),
                'cover': template_data.get('cover', ''),
                'is_active': template_data.get('is_active', True),
                'is_default': template_data.get('is_default', False),
                'order': template_data.get('order', 0),
                'content': {
                    'blocks': template_data.get('content', {}).get('blocks', []),
                    'properties': template_data.get('content', {}).get('properties', {}),
                    'schema': template_data.get('content', {}).get('schema', {})
                },
                'metadata': {
                    'created_at': datetime.datetime.utcnow(),
                    'updated_at': datetime.datetime.utcnow(),
                    'created_by': template_data.get('created_by'),
                    'category': template_data.get('category', 'general'),
                    'tags': template_data.get('tags', []),
                    'version': 1
                }
            }
            
            result = self.collection.insert_one(template)
            template['_id'] = result.inserted_id
            return template

        def get_all_templates(self, filters=None):
            """Get all templates with optional filters"""
            if not self.collection:
                return []
                
            query = filters or {}
            if 'is_active' not in query:
                query['is_active'] = True
                
            templates = list(self.collection.find(query).sort([('order', 1), ('metadata.created_at', -1)]))
            for template in templates:
                template['id'] = str(template['_id'])
            return templates

        def get_template_by_id(self, template_id):
            """Get template by ID"""
            if not self.collection:
                return None
                
            try:
                template = self.collection.find_one({'_id': ObjectId(template_id)})
                if template:
                    template['id'] = str(template['_id'])
                return template
            except:
                return None

        def update_template(self, template_id, update_data):
            """Update template"""
            if not self.collection:
                return False
                
            try:
                update_data['metadata.updated_at'] = datetime.datetime.utcnow()
                if 'content' in update_data:
                    # Increment version when content changes
                    self.collection.update_one(
                        {'_id': ObjectId(template_id)},
                        {'$inc': {'metadata.version': 1}}
                    )
                
                result = self.collection.update_one(
                    {'_id': ObjectId(template_id)},
                    {'$set': update_data}
                )
                return result.modified_count > 0
            except:
                return False

        def delete_template(self, template_id):
            """Delete template"""
            if not self.collection:
                return False
                
            try:
                result = self.collection.delete_one({'_id': ObjectId(template_id)})
                return result.deleted_count > 0
            except:
                return False

        def get_templates_by_type(self, template_type):
            """Get templates by type"""
            return self.get_all_templates({'type': template_type})

        def search_templates(self, search_term):
            """Search templates by name or description"""
            query = {
                '$or': [
                    {'name': {'$regex': search_term, '$options': 'i'}},
                    {'description': {'$regex': search_term, '$options': 'i'}},
                    {'metadata.tags': {'$regex': search_term, '$options': 'i'}}
                ],
                'is_active': True
            }
            return self.get_all_templates(query)


    class UserDocument:
        """User-created documents from templates"""
        
        def __init__(self, db_connection=None):
            self.db = db_connection or MongoDBConnection()
            self.collection = self.db.user_documents if self.db.db else None

        def create_document(self, user_id, template_id, document_data):
            """Create a new document from template"""
            if not self.collection:
                raise Exception("MongoDB not available")
                
            document = {
                'user_id': user_id,
                'template_id': template_id,
                'title': document_data.get('title', 'Untitled'),
                'content': document_data.get('content', {}),
                'metadata': {
                    'created_at': datetime.datetime.utcnow(),
                    'updated_at': datetime.datetime.utcnow(),
                    'is_favorite': False,
                    'is_archived': False,
                    'tags': document_data.get('tags', []),
                    'version': 1
                }
            }
            
            result = self.collection.insert_one(document)
            document['_id'] = result.inserted_id
            return document

        def get_user_documents(self, user_id, filters=None):
            """Get all documents for a user"""
            if not self.collection:
                return []
                
            query = {'user_id': user_id}
            if filters:
                query.update(filters)
                
            documents = list(self.collection.find(query).sort('metadata.updated_at', -1))
            for doc in documents:
                doc['id'] = str(doc['_id'])
            return documents

        def update_document(self, document_id, update_data):
            """Update document"""
            if not self.collection:
                return False
                
            try:
                update_data['metadata.updated_at'] = datetime.datetime.utcnow()
                result = self.collection.update_one(
                    {'_id': ObjectId(document_id)},
                    {'$set': update_data, '$inc': {'metadata.version': 1}}
                )
                return result.modified_count > 0
            except:
                return False


    # Predefined Notion-like template structures
    NOTION_TEMPLATE_EXAMPLES = {
        'study_plan': {
            'name': 'Study Plan Template',
            'type': 'study_plan',
            'description': 'Organize your study schedule and track progress',
            'icon': '📚',
            'category': 'education',
            'content': {
                'blocks': [
                    {
                        'id': 'title',
                        'type': 'heading_1',
                        'content': 'My Study Plan',
                        'properties': {}
                    },
                    {
                        'id': 'overview',
                        'type': 'text',
                        'content': 'Plan Overview',
                        'properties': {'placeholder': 'Describe your study goals...'}
                    },
                    {
                        'id': 'subjects',
                        'type': 'database',
                        'content': 'Study Subjects',
                        'properties': {
                            'columns': [
                                {'name': 'Subject', 'type': 'title'},
                                {'name': 'Priority', 'type': 'select', 'options': ['High', 'Medium', 'Low']},
                                {'name': 'Hours/Week', 'type': 'number'},
                                {'name': 'Progress', 'type': 'progress'},
                                {'name': 'Deadline', 'type': 'date'}
                            ]
                        }
                    },
                    {
                        'id': 'schedule',
                        'type': 'calendar',
                        'content': 'Study Schedule',
                        'properties': {'view_type': 'week'}
                    }
                ],
                'properties': {
                    'total_hours': {'type': 'formula', 'formula': 'sum(subjects.hours_week)'},
                    'completion_rate': {'type': 'formula', 'formula': 'avg(subjects.progress)'}
                }
            }
        },
        'goal_tracker': {
            'name': 'Goal Tracker Template',
            'type': 'goal_tracker',
            'description': 'Track your personal and professional goals',
            'icon': '🎯',
            'category': 'productivity',
            'content': {
                'blocks': [
                    {
                        'id': 'title',
                        'type': 'heading_1',
                        'content': 'Goal Tracker 2024',
                        'properties': {}
                    },
                    {
                        'id': 'goals',
                        'type': 'database',
                        'content': 'Goals Database',
                        'properties': {
                            'columns': [
                                {'name': 'Goal', 'type': 'title'},
                                {'name': 'Category', 'type': 'select', 'options': ['Career', 'Health', 'Personal']},
                                {'name': 'Status', 'type': 'select', 'options': ['Not Started', 'In Progress', 'Completed']},
                                {'name': 'Progress', 'type': 'progress'},
                                {'name': 'Deadline', 'type': 'date'}
                            ]
                        }
                    }
                ]
            }
        }
    }

else:
    # Fallback classes when MongoDB is not available
    class NotionTemplate:
        def __init__(self, *args, **kwargs):
            pass
        def get_all_templates(self, *args, **kwargs):
            return []
        def create_template(self, *args, **kwargs):
            raise Exception("MongoDB not available. Please install pymongo.")
        def update_template(self, *args, **kwargs):
            return False
        def delete_template(self, *args, **kwargs):
            return False
        def get_templates_by_type(self, *args, **kwargs):
            return []
        def search_templates(self, *args, **kwargs):
            return []

    class UserDocument:
        def __init__(self, *args, **kwargs):
            pass
        def get_user_documents(self, *args, **kwargs):
            return []
        def create_document(self, *args, **kwargs):
            raise Exception("MongoDB not available. Please install pymongo.")
        def update_document(self, *args, **kwargs):
            return False

    NOTION_TEMPLATE_EXAMPLES = {}
