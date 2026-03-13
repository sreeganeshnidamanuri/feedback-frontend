import axios from "axios";

const API_URL = "http://localhost:8080/api/feedbacks";

// Get all feedbacks
const getAllFeedbacks = () => axios.get(API_URL);

// Create feedback
const createFeedback = (data) => axios.post(API_URL, data);

// Delete feedback
const deleteFeedback = (id) => axios.delete(`${API_URL}/${id}`);

// Update status
const updateStatus = (id, status) =>
  axios.patch(`${API_URL}/${id}/status?status=${status}`);

// Update feedback (for edit modal)
const updateFeedback = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

// Get statistics
const getStats = () => axios.get(`${API_URL}/stats`);

export default {
  getAllFeedbacks,
  createFeedback,
  deleteFeedback,
  updateStatus,
  updateFeedback,
  getStats
};