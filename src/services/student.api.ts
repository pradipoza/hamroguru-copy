import axios from 'axios';

const API_URL = '/api/student';

export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};
