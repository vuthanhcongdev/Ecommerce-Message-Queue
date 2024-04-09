const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/Ecommerce';

const testSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const testModel = mongoose.model('test', testSchema);

describe('MongoDB Test', () => {
    beforeAll(async () => {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should connect to MongoDB', async () => {
        expect(mongoose.connection.readyState).toEqual(1);
    });

    it('should insert a doc into collection', async () => {
        const mockTest = { name: 'test', age: 20 };
        await testModel.create(mockTest);

        const insertedTest = await testModel.findOne({ name: 'test' });
        expect(insertedTest.name).toEqual('test');
    });
});