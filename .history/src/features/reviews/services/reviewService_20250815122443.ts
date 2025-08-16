import axios from 'axios';

const API_URL = '/api/reviews';

export const createReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData);
  return response.data;
};

export const getServiceReviews = async (serviceId, page = 1, limit = 5) => {
  const response = await axios.get(`${API_URL}/service/${serviceId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserReviews = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await axios.put(`${API_URL}/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`${API_URL}/${reviewId}`);
  return response.data;
};

export const markHelpful = async (reviewId) => {
  const response = await axios.post(`${API_URL}/${reviewId}/helpful`);
  return response.data;
};

export const getReviewStats = async (serviceId) => {
  const response = await axios.get(`${API_URL}/stats/${serviceId}`);
  return response.data;
};
