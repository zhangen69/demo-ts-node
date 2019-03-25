import mongoose from 'mongoose';
import auditable from './auditable.model';

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    rules: { type: String, required: true },
});

schema.add(auditable);

export default mongoose.model('User', schema);
