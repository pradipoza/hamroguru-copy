import api from '@/lib/api';

const API_URL = '/subjects';

export const getSubjectByCode = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}`);
  return response.data;
};

export const getHomeworkForSubject = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}/homework`);
  return response.data;
};

export const getNotesForSubject = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}/notes`);
  return response.data;
};

export const getTestsForSubject = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}/tests`);
  return response.data;
};

export const getResourcesForSubject = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}/resources`);
  return response.data;
};

export const getAiTutorSession = async (subjectCode: string) => {
  const response = await api.get(`${API_URL}/${subjectCode}/ai-tutor`);
  return response.data;
};

export const postAiTutorMessage = async (subjectCode: string, message: { role: 'user'; content: string; imageUrl?: string }) => {
  const response = await api.post(`${API_URL}/${subjectCode}/ai-tutor`, { message });
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
