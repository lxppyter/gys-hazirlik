
import path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

async function debugDb() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found');
        }
        console.log('Connecting to DB...');
        // Specify databaseName if needed, or rely on URI
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to database: '${mongoose.connection.name}'`);

        if (!mongoose.connection.db) {
            throw new Error('DB connection established but .db property is undefined');
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('--- Collections Found ---');
        console.log(collections.map(c => c.name));
        console.log('-------------------------');

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`Collection '${col.name}' has ${count} documents.`);
        }

        const modelName = 'PracticeExam';
        // Mongoose pluralizes by default: lowercases and adds 's'
        // But let's check what Mongoose THINKS it should be.
        const defaultCollectionName = mongoose.pluralize ? mongoose.pluralize()(modelName) : 'practiceexams'; 
        console.log(`\nMongoose expected collection for '${modelName}': '${defaultCollectionName}'`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugDb();

