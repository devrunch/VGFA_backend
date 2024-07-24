import mongoose from 'mongoose';

const OfficialUpdateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Official',
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

const OfficialUpdate = mongoose.model('OfficialUpdate', OfficialUpdateSchema);
export default OfficialUpdate;
