import axios from "axios";

const API = axios.create({
  baseURL: "https://feedback-backend-xfzw.onrender.com",
});

// Get all feedbacks
const getAllFeedbacks = () => API.get("/api/feedbacks");

// Create feedback
const createFeedback = (data) => API.post("/api/feedbacks", data);

// Delete feedback
const deleteFeedback = (id) => API.delete(`/api/feedbacks/${id}`);

// Update status
const updateStatus = (id, status) =>
  API.patch(`/api/feedbacks/${id}/status?status=${status}`);

// Update feedback
const updateFeedback = (id, data) =>
  API.put(`/api/feedbacks/${id}`, data);

// Get statistics
const getStats = () => API.get("/api/feedbacks/stats");

export default {
  getAllFeedbacks,
  createFeedback,
  deleteFeedback,
  updateStatus,
  updateFeedback,
  getStats
};