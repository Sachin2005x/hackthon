import { MongoClient } from 'mongodb';

const DB_NAME = process.env.MONGODB_DB || 'personaforge';

let client = null;
let database = null;

export async function connectDB() {
  if (database) return database;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env');
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    appName: 'personaforge'
  });
  await client.connect();
  database = client.db(DB_NAME);
  await database
    .collection('runs')
    .updateMany({ status: { $in: ['queued', 'running'] } }, { $set: { status: 'interrupted' } });
  console.log(`MongoDB Atlas connected → db "${DB_NAME}"`);
  return database;
}

async function getDB() {
  if (!database) throw new Error('Database not connected. Call connectDB() before using the store.');
  return database;
}

export async function runsCollection() {
  const d = await getDB();
  return d.collection('runs');
}

export function docToRun(doc) {
  return {
    id: doc._id,
    createdAt: doc.createdAt,
    status: doc.status,
    stageIndex: doc.stageIndex,
    progress: doc.progress,
    seed: doc.seed,
    product: doc.product,
    stages: doc.stages,
    data: doc.data ?? null
  };
}
