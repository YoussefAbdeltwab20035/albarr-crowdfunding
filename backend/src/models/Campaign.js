import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      ar: { type: String, required: true },
      en: { type: String, default: '' }
    },
    description: {
      ar: { type: String, required: true },
      en: { type: String, default: '' }
    },
    category: {
      ar: { type: String, required: true },
      en: { type: String, default: '' }
    },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    backers: { type: Number, default: 0 },
    daysLeft: { type: Number, default: 30 },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    author: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
      email: { type: String, default: '' },
      verified: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;