import api from '@/lib/api';

const API_URL = '/student';

export const getDashboardData = async () => {
  const response = await api.get(`${API_URL}/dashboard`);
  return response.data;
};
