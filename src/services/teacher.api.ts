import axios from 'axios';

const API_URL = '/api/teacher';

export const getProfileData = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};
