import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL!;

let client: MongoClient;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db();
}