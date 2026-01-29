import api from '@/lib/api';

const API_URL = '/teacher';

export const getProfileData = async () => {
  const response = await api.get(`${API_URL}/profile`);
  return response.data;
};
