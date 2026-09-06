export const mockCampaigns = [
  {
    id: '1',
    category: { ar: 'مجتمعي', en: 'Community' },
    isEndingSoon: true,
    author: { ar: 'مؤسسة الأمل', en: 'Amal Foundation', verified: true },
    title: {
      ar: 'مياه نظيفة لقرية النهضة',
      en: 'Clean Water for Al-Nahda Village'
    },
    description: {
      ar: 'حفر بئر مياه نظيفة يخدم أكثر من 400 أسرة في صعيد مصر وتوفير شبكة توزيع آمنة...',
      en: 'Drilling a clean-water well serving 400+ families in Upper Egypt and installing safe distribution...'
    },
    raised: 328000,
    goal: 400000,
    backers: 1240,
    daysLeft: 6,
    image: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    category: { ar: 'تعليم', en: 'Education' },
    isEndingSoon: false,
    author: { ar: 'م. كريم حسن', en: 'Eng. Karim Hassan', verified: true },
    title: {
      ar: 'طاقة شمسية لمدرسة الأمل',
      en: 'Solar Power for Al-Amal School'
    },
    description: {
      ar: 'تركيب محطة ألواح شمسية لتوفير كهرباء نظيفة ومستدامة لـ 600 طالب ومعمل كمبيوتر...',
      en: 'Installing solar panels to power clean electricity for 600 students and digital labs...'
    },
    raised: 195000,
    goal: 500000,
    backers: 812,
    daysLeft: 21,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    category: { ar: 'حرف يدوية', en: 'Craft' },
    isEndingSoon: false,
    author: { ar: 'تعاونية سنابل', en: 'Sanabel Co-op', verified: false },
    title: {
      ar: 'ورشة سيدات صعيد مصر',
      en: 'Women of Upper Egypt Workshop'
    },
    description: {
      ar: 'دعم ورشة حرف يدوية وتطريز لتمكين 30 سيدة معيلة وتأمين تسويق منتجاتهن...',
      en: 'Backing a handicraft workshop empowering 30 women to preserve heritage crafts...'
    },
    raised: 84000,
    goal: 120000,
    backers: 476,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    category: { ar: 'زراعة', en: 'Agriculture' },
    isEndingSoon: true,
    author: { ar: 'مبادرة الأرض الخضراء', en: 'Green Earth Initiative', verified: true },
    title: {
      ar: 'مزرعة مجتمعية مستدامة',
      en: 'Sustainable Community Farm'
    },
    description: {
      ar: 'مشروع تعاوني زراعي لإنتاج خضروات عضوية بنظام الري بالتنقيط وتوفير فرص عمل...',
      en: 'A cooperative farm producing organic vegetables with modern drip-irrigation systems...'
    },
    raised: 268000,
    goal: 300000,
    backers: 1580,
    daysLeft: 3,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  }
];

export const mockRewards = [
  {
    id: 'r1',
    amount: 250,
    tier: { ar: 'داعم', en: 'Supporter' },
    backers: 640,
    description: {
      ar: 'شكر شخصي وإدراج اسمك في لوحة الشرف الرقمية لداعمي المشروع.',
      en: 'A personal thank-you and your name on the digital backers wall.'
    },
    perks: [
      { ar: 'بطاقة شكر رقمية مخصصة', en: 'Digital thank-you card' },
      { ar: 'تحديثات حصرية ومباشرة عن مسار الحملة', en: 'Exclusive campaign updates' }
    ],
    deliveryDate: 'Jul 2026',
    itemsLeft: null
  },
  {
    id: 'r2',
    amount: 750,
    tier: { ar: 'مناصر', en: 'Advocate' },
    backers: 218,
    isLimited: true,
    description: {
      ar: 'جميع مزايا الداعم، بالإضافة إلى هدية تذكارية يدوية الصنع من مخرجات المشروع.',
      en: 'All Supporter rewards, plus a handmade gift directly from the project.'
    },
    perks: [
      { ar: 'كافة مميزات فئة داعم', en: 'All Supporter rewards' },
      { ar: 'هدية يدوية تذكارية حصرية', en: 'Exclusive handmade gift' },
      { ar: 'شهادة مساهمة موثقة', en: 'Contribution certificate' }
    ],
    deliveryDate: 'Aug 2026',
    itemsLeft: 40
  },
  {
    id: 'r3',
    amount: 2500,
    tier: { ar: 'شريك الأثر', en: 'Champion' },
    backers: 32,
    isLimited: true,
    description: {
      ar: 'دعوة لحضور افتتاح المشروع ووضع اسمك محفوراً على اللوحة التذكارية في الموقع.',
      en: 'An invitation to visit the project and an honor plaque on-site with your name.'
    },
    perks: [
      { ar: 'كافة مميزات الفئات السابقة', en: 'All previous rewards' },
      { ar: 'زيارة ميدانية وحضور حفل الافتتاح', en: 'On-site project visit' },
      { ar: 'لوحة شرف تذكارية باسمك في الموقع', en: 'Honor plaque with your name' }
    ],
    deliveryDate: 'Sep 2026',
    itemsLeft: 3
  }
];