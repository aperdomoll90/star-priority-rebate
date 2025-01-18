import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
if (!uri) {
  throw new Error('Missing MONGO_URI environment variable')
}

const mongoClient = new MongoClient(uri)

async function connectToMongodb() {
  await mongoClient.connect()
  return mongoClient.db()
}

export default connectToMongodb
