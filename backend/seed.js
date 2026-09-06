import dotenv from 'dotenv';
dotenv.config();

import Campaign from './src/models/Campaign.js';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

const seedData = async () => {
  try {
    // الاتصال بالقاعدة بعد تحميل dotenv
    await connectDB();

    // تنظيف البيانات السابقة
    await Campaign.deleteMany();
    await User.deleteMany();

    // إنشاء مستخدم مشرف تجريبي
    const adminUser = await User.create({
      name: 'يوسف عبد التواب',
      email: 'admin@albarr.org',
      password: 'password123',
      role: 'admin'
    });

    console.log(`👤 Admin created: ${adminUser.email} / password123`);

    // إدخال حملات تجريبية موثقة
    const dummyCampaigns = [
      {
        title: { ar: 'حفر بئر وتوصيل مياه لقرية الأمل', en: 'Clean Water Well for Al-Amal Village' },
        description: { ar: 'توفير مياه شرب نقية ومستدامة لأكثر من 300 أسرة تعاني من شح المياه.', en: 'Providing sustainable clean water infrastructure for over 300 families.' },
        category: { ar: 'مياه وإغاثة', en: 'Water & Relief' },
        goal: 120000,
        raised: 85000,
        backers: 42,
        daysLeft: 12,
        image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80',
        status: 'approved',
        author: { ar: 'مؤسسة نهر الحياة', en: 'Life River Org', verified: true }
      },
      {
        title: { ar: 'تجهيز معمل حاسب آلي لطلاب الصعيد', en: 'Computer Lab for Upper Egypt Students' },
        description: { ar: 'تزويد 25 جهاز حاسوب وتدريب 100 طالب على البرمجة وأساسيات الذكاء الاصطناعي.', en: 'Equipping 25 PCs and teaching coding to 100 passionate students.' },
        category: { ar: 'تعليم وتكنولوجيا', en: 'Tech & Education' },
        goal: 90000,
        raised: 45000,
        backers: 28,
        daysLeft: 19,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        status: 'approved',
        author: { ar: 'مبادرة مبرمج الغد', en: 'Tomorrow Coders', verified: true }
      },
      {
        title: { ar: 'دعم صغار المزارعين بمضخات طاقة شمسية', en: 'Solar Water Pumps for Small Farmers' },
        description: { ar: 'استبدال ماكينات الديزل الملوثة بمضخات تعمل بالطاقة الشمسية لخفض التكاليف وحماية البيئة.', en: 'Solar powered irrigation to empower smallholder agriculture.' },
        category: { ar: 'زراعة وتنمية', en: 'Agriculture' },
        goal: 150000,
        raised: 110000,
        backers: 67,
        daysLeft: 8,
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        status: 'approved',
        author: { ar: 'جمعية نماء الخضراء', en: 'Namaa Green Foundation', verified: true }
      }
    ];

    await Campaign.insertMany(dummyCampaigns);
    console.log('✅ Campaigns seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();