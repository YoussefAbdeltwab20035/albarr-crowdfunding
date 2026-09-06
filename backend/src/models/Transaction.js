import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    campaignTitle: { type: String, required: true },
    donorName: { type: String, default: 'فاعل خير' },
    donorEmail: { type: String, default: '' },
    amount: { type: Number, required: true },
    method: { type: String, default: 'InstaPay' },
    cheerMessage: { type: String, default: '' },
    status: { type: String, default: 'completed' }
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;