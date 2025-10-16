# Notion-Style Sidebar Implementation Guide

## 🎯 Overview

A fully functional Notion-style sidebar has been implemented for Self-Ora with:
- ✅ Workspace switching
- ✅ Hierarchical page navigation
- ✅ Favorites & Recent pages
- ✅ Search functionality
- ✅ Quick actions (create, edit, delete, duplicate)
- ✅ Collapsible sections
- ✅ Responsive design (mobile & desktop)
- ✅ Keyboard shortcuts (Ctrl/Cmd + \\)

## 📂 Files Created

### 1. Main Component
**`components/sidebar/notion-sidebar.tsx`**
- Complete Notion-style sidebar implementation
- Workspace switcher with dropdown
- Hierarchical page tree with expand/collapse
- Favorites and Recent sections
- Search bar
- Quick actions menu (edit, delete, duplicate, favorite)
- Mobile responsive with overlay

### 2. State Management
**`store/sidebarStore.ts`**
- Zustand store for sidebar state
- Persistent storage (localStorage)
- Actions for workspace/page management
- Recent pages tracking

## 🚀 Usage

### Basic Implementation

```tsx
import { NotionSidebar } from "@/components/sidebar/notion-sidebar";

export default function DashboardLayout() {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
    // Navigate to page or load page content
    router.push(`/page/${pageId}`);
  };

  return (
    <div className="flex min-h-screen">
      <NotionSidebar
        defaultOpen={true}
        onPageSelect={handlePageSelect}
        currentPageId={currentPageId}
      />
      
      {/* Main content area */}
      <main className="flex-1 ml-0 md:ml-64 transition-all">
        <YourPageContent pageId={currentPageId} />
      </main>
    </div>
  );
}
```

### With Zustand Store

```tsx
import { NotionSidebar } from "@/components/sidebar/notion-sidebar";
import { useSidebarStore } from "@/store/sidebarStore";

export default function DashboardLayout() {
  const { currentPageId, setCurrentPageId } = useSidebarStore();

  return (
    <div className="flex min-h-screen">
      <NotionSidebar
        onPageSelect={setCurrentPageId}
        currentPageId={currentPageId}
      />
      <main className="flex-1">
        {/* Content */}
      </main>
    </div>
  );
}
```

## 🎨 Features

### 1. Workspace Switcher
- Displays current workspace with icon
- Dropdown to switch between workspaces
- Create new workspace option
- Persists selected workspace

### 2. Search Functionality
- Search across all pages in workspace
- Debounced input for performance
- Fuzzy search support (can integrate Fuse.js)

### 3. Quick Access Section
- Dashboard
- Goals
- Learning
- Custom quick links

### 4. Favorites
- Star/unstar pages
- Dedicated favorites section
- Quick access to important pages

### 5. Recent Pages
- Tracks last 5 visited pages
- Auto-updates on page navigation
- Persists across sessions

### 6. Page Tree
- Hierarchical page structure
- Expand/collapse nested pages
- Drag & drop support (can be added with @dnd-kit)
- Context menu on hover (edit, delete, duplicate)

### 7. Actions Menu
- **Edit**: Rename page
- **Favorite**: Toggle favorite status
- **Duplicate**: Clone page with content
- **Delete**: Remove page with confirmation

### 8. Responsive Design
- Mobile: Overlay sidebar with backdrop
- Desktop: Fixed sidebar with collapse toggle
- Smooth transitions

### 9. Keyboard Shortcuts
- `Ctrl/Cmd + \`: Toggle sidebar
- Can be extended with more shortcuts

## 🔧 Backend Requirements

### Django Models

```python
# users/models.py or pages/models.py

from django.db import models
import uuid

class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, blank=True, null=True)  # Emoji
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='pages')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    title = models.CharField(max_length=255, default='Untitled')
    icon = models.CharField(max_length=10, blank=True, null=True)  # Emoji
    content = models.TextField(blank=True, null=True)  # JSON content
    order = models.IntegerField(default=0)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title
```

### API Endpoints

```python
# users/views.py or pages/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all workspaces for user"""
        workspaces = Workspace.objects.filter(owner=request.user)
        serializer = WorkspaceSerializer(workspaces, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        """Create new workspace"""
        serializer = WorkspaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class PageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all pages for workspace"""
        workspace_id = request.query_params.get('workspace')
        pages = Page.objects.filter(workspace_id=workspace_id, workspace__owner=request.user)
        serializer = PageSerializer(pages, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        """Create new page"""
        serializer = PageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class PageDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Page.objects.get(pk=pk, workspace__owner=user)
        except Page.DoesNotExist:
            return None

    def patch(self, request, pk):
        """Update page"""
        page = self.get_object(pk, request.user)
        if not page:
            return Response({'success': False, 'message': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PageSerializer(page, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete page"""
        page = self.get_object(pk, request.user)
        if not page:
            return Response({'success': False, 'message': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
        
        page.delete()
        return Response({'success': True, 'message': 'Page deleted successfully'})


class PageDuplicateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Duplicate page"""
        page = Page.objects.get(pk=pk, workspace__owner=request.user)
        new_page = Page.objects.create(
            workspace=page.workspace,
            parent=page.parent,
            title=f"{page.title} (Copy)",
            icon=page.icon,
            content=page.content,
            order=page.order + 1,
        )
        serializer = PageSerializer(new_page)
        return Response({'success': True, 'data': serializer.data})


class RecentPagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get recent pages - can track via user activity"""
        # This is a simplified version
        # You should track page views in a separate UserActivity model
        pages = Page.objects.filter(workspace__owner=request.user).order_by('-updated_at')[:5]
        serializer = PageSerializer(pages, many=True)
        return Response({'success': True, 'data': serializer.data})
```

### URL Configuration

```python
# users/urls.py or pages/urls.py

from django.urls import path
from .views import (
    WorkspaceListView,
    PageListView,
    PageDetailView,
    PageDuplicateView,
    RecentPagesView
)

urlpatterns = [
    path('api/workspaces/', WorkspaceListView.as_view(), name='workspaces'),
    path('api/pages/', PageListView.as_view(), name='pages'),
    path('api/pages/<str:pk>/', PageDetailView.as_view(), name='page-detail'),
    path('api/pages/<str:pk>/duplicate/', PageDuplicateView.as_view(), name='page-duplicate'),
    path('api/pages/recent/', RecentPagesView.as_view(), name='recent-pages'),
]
```

### Serializers

```python
# users/serializers.py

from rest_framework import serializers
from .models import Workspace, Page

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['id', 'name', 'icon', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


class PageSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ['id', 'workspace', 'parent', 'title', 'icon', 'content', 'order', 'is_favorite', 'children', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_children(self, obj):
        # Only include children if explicitly requested
        if self.context.get('include_children', False):
            children = obj.children.all()
            return PageSerializer(children, many=True, context=self.context).data
        return []
```

## 🎨 Styling

The sidebar uses Tailwind CSS classes and supports dark mode automatically. Key color scheme:

- **Background**: `bg-white dark:bg-gray-900`
- **Hover**: `hover:bg-gray-100 dark:hover:bg-gray-800`
- **Active**: `bg-gray-200 dark:bg-gray-700`
- **Border**: `border-gray-200 dark:border-gray-800`
- **Text**: `text-gray-700 dark:text-gray-300`

## 🔌 Optional Enhancements

### 1. Add Drag & Drop

```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

### 2. Add Fuzzy Search

```bash
npm install fuse.js
```

### 3. Add Zustand Persist

```bash
npm install zustand
```

## 🐛 Troubleshooting

### Issue: Sidebar not showing
**Solution**: Ensure parent container has `flex` layout and sidebar is positioned correctly.

### Issue: Mobile overlay not working
**Solution**: Check z-index values and ensure overlay click handler is attached.

### Issue: Pages not loading
**Solution**: Verify API endpoints are correct and authentication token is valid.

## 📚 Next Steps

1. **Install Zustand**: `npm install zustand`
2. **Create Backend Models**: Add Workspace and Page models
3. **Implement API Endpoints**: Create views and URLs
4. **Run Migrations**: `python manage.py makemigrations && python manage.py migrate`
5. **Test Integration**: Connect frontend to backend
6. **Add Drag & Drop**: Implement page reordering
7. **Add Real-time Sync**: WebSocket for live collaboration

## ✅ Checklist

- [x] Sidebar component created
- [x] State management store created
- [x] Workspace switcher implemented
- [x] Page tree navigation
- [x] Favorites & Recent sections
- [x] Search functionality
- [x] Quick actions menu
- [x] Mobile responsive
- [x] Keyboard shortcuts
- [ ] Backend models created
- [ ] API endpoints implemented
- [ ] Drag & drop added
- [ ] Real-time sync (optional)

---

**Last Updated**: October 16, 2025  
**Version**: 1.0  
**Status**: ✅ Frontend Complete, Backend Pending
