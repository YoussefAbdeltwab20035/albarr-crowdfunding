import Transaction from '../models/Transaction.js';
import Campaign from '../models/Campaign.js';

// إنشاء تبرع جديد
export const createPledge = async (req, res) => {
  try {
    const { campaignId, amount, donorName, donorEmail, method, cheerMessage } = req.body;

    const donationAmount = Number(amount);
    if (!donationAmount || donationAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'يرجى إدخال مبلغ تبرع صحيح وأكبر من الصفر.' 
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        message: 'الحملة غير موجودة' 
      });
    }

    // التحقق مما إذا كانت الحملة قد حققت هدفها بنسبة 100% أو أكثر
    const currentRaised = Number(campaign.raised) || 0;
    const goal = Number(campaign.goal) || 1;

    if (currentRaised >= goal) {
      return res.status(400).json({
        success: false,
        message: 'تم اكتمال تمويل هذه الحملة بنجاح 100%! تم إيقاف استقبال التبرعات لتوجيه الدعم للمشاريع الأخرى.'
      });
    }

    // تحديد عنوان الحملة بمرونة سواء كان نصاً أو كائناً لغوياً
    const campaignTitle = 
      typeof campaign.title === 'string' 
        ? campaign.title 
        : (campaign.title?.ar || campaign.title?.en || 'مشروع عَ البَرّ');

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const transaction = new Transaction({
      txnId,
      campaignId,
      campaignTitle,
      donorName: donorName || 'فاعل خير',
      donorEmail: donorEmail || '',
      amount: donationAmount,
      method: method || 'InstaPay',
      cheerMessage: cheerMessage || '',
      status: 'completed'
    });

    await transaction.save();

    // تحديث أرقام الحملة وحفظها
    campaign.raised = currentRaised + donationAmount;
    campaign.backers = (Number(campaign.backers) || 0) + 1;
    await campaign.save();

    res.status(201).json({
      success: true,
      transaction,
      updatedCampaign: {
        id: campaign._id,
        raised: campaign.raised,
        backers: campaign.backers,
        isCompleted: campaign.raised >= campaign.goal
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// جلب كل المعاملات
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};