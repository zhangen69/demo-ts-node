import mongoose from 'mongoose';
import auditable from './auditable.model';

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    photoUrl: { type: String, default: null },
});

schema.add(auditable);

export default mongoose.model('Product', schema);
