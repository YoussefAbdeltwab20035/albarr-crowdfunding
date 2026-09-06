import Campaign from '../models/Campaign.js';

// جلب كل الحملات
export const getCampaigns = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category && category !== 'all') {
      query['category.ar'] = category;
    }

    if (search) {
      query.$or = [
        { 'title.ar': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } }
      ];
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب حملة بالـ ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'الحملة غير موجودة' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إنشاء حملة جديدة
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign({
      ...req.body,
      status: 'pending',
      author: {
        ...req.body.author,
        verified: false
      }
    });
    const saved = await campaign.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// تعديل بيانات الحملة
export const updateCampaign = async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'الحملة غير موجودة' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// تبديل حالة التوثيق والاعتماد (خاص بالأدمن)
export const toggleVerifyCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'الحملة غير موجودة' });

    const isCurrentlyApproved = campaign.status === 'approved' && campaign.author?.verified === true;
    const nextState = !isCurrentlyApproved;

    campaign.status = nextState ? 'approved' : 'pending';
    if (!campaign.author) campaign.author = {};
    campaign.author.verified = nextState;

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف حملة
export const deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'الحملة غير موجودة' });
    res.json({ message: 'تم حذف الحملة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};