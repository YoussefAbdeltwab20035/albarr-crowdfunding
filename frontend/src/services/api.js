import axios from 'axios';

// إنشاء نسخة Axios مخصصة مع الرابط الأساسي للـ Backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة التوكن تلقائياً مع أي طلب يتطلب مصادقة
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('albarr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== مسارات الحملات (Campaigns) ==========

// جلب الحملات المعتمدة للواجهة
export const fetchCampaigns = async (params = {}) => {
  const response = await API.get('/campaigns', { params });
  return response.data;
};

// جلب تفاصيل حملة مفردة
export const fetchCampaignById = async (id) => {
  const response = await API.get(`/campaigns/${id}`);
  return response.data;
};

// إنشاء حملة جديدة
export const createCampaignAPI = async (campaignData) => {
  const response = await API.post('/campaigns', campaignData);
  return response.data;
};

// تعديل أو اعتماد حملة (للأدمن)
export const toggleVerifyCampaignAPI = async (id) => {
  const response = await API.put(`/campaigns/${id}/toggle-verify`);
  return response.data;
};

// ========== مسارات التبرعات والمعاملات (Transactions) ==========

// إتمام تبرع/مساهمة جديدة
export const createPledgeAPI = async (donationData) => {
  const response = await API.post('/transactions', donationData);
  return response.data;
};

// جلب سجل المعاملات (لوحة الأدمن)
export const fetchTransactionsAPI = async () => {
  const response = await API.get('/transactions');
  return response.data;
};

// ========== مسارات المستخدمين والمصادقة (Auth) ==========

// تسجيل الدخول
export const loginAPI = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('albarr_token', response.data.token);
    localStorage.setItem('albarr_user', JSON.stringify(response.data));
  }
  return response.data;
};

// تسجيل حساب جديد
export const registerAPI = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('albarr_token', response.data.token);
    localStorage.setItem('albarr_user', JSON.stringify(response.data));
  }
  return response.data;
};

// تسجيل الخروج
export const logoutUser = () => {
  localStorage.removeItem('albarr_token');
  localStorage.removeItem('albarr_user');
};

export default API;