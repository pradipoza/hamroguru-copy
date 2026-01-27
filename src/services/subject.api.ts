import axios from 'axios';

const API_URL = '/api/subjects';

export const getSubjectByCode = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}`);
  return response.data;
};

export const getHomeworkForSubject = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}/homework`);
  return response.data;
};

export const getNotesForSubject = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}/notes`);
  return response.data;
};

export const getTestsForSubject = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}/tests`);
  return response.data;
};

export const getResourcesForSubject = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}/resources`);
  return response.data;
};

export const getAiTutorSession = async (subjectCode: string) => {
  const response = await axios.get(`${API_URL}/${subjectCode}/ai-tutor`);
  return response.data;
};

export const postAiTutorMessage = async (subjectCode: string, sessionId: string, message: { role: 'user'; content: string }) => {
  const response = await axios.post(`${API_URL}/${subjectCode}/ai-tutor`, { sessionId, message });
  return response.data;
};
