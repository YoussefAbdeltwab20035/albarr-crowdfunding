import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// التحقق من تسجيل الدخول وصحة التوكن
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح، يرجى تسجيل الدخول أولاً' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_albarr_jwt_key_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'المستخدم صاحب هذا التوكن لم يعد موجوداً' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'توكن غير صالح أو منتهي الصلاحية' });
  }
};

// قصر الوصول على المشرفين فقط (Admin Only)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'هذا الإجراء مخصص لمديري المنصة فقط' });
  }
};