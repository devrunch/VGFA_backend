import mongoose from 'mongoose';

const PanchayatUpdateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Panchayat',
    required: true,
  },
  updates: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PanchayatUpdate = mongoose.model('PanchayatUpdate', PanchayatUpdateSchema);
export default PanchayatUpdate;
