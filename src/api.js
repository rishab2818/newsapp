// api.js (Centralized API Service - No Functionality Change)
import axios from "axios";

const API_URL = "https://test0xfafa5555.onrender.com";

export const fetchPosts = async (type) => {
  try {
    const res = await axios.get(`${API_URL}/posts?ctype=${type}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchAnswers = async (postId) => {
  try {
    const res = await axios.get(`${API_URL}/answers?postId=${postId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching answers:", error);
    return [];
  }
};

export const submitAnswer = async (postId, content) => {
  try {
    await axios.post(`${API_URL}/answers`, { postId, content });
  } catch (error) {
    console.error("Error submitting answer:", error);
  }
};

export const likePost = async (id) => {
  try {
    await axios.post(`${API_URL}/like/${id}`);
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

export const likeAnswer = async (answerId) => {
  try {
    await axios.post(`${API_URL}/like-answer/${answerId}`);
  } catch (error) {
    console.error("Error liking answer:", error);
  }
};
