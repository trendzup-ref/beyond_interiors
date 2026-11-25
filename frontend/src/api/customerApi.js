import axios from "axios";

const API_BASE = "/api/public";

export const getInstallationServices = async () => {
  try {
    const res = await axios.get(`${API_BASE}/installations/services`);
    return res.data?.data?.services || [];
  } catch (err) {
    console.error("Error fetching services", err);
    return [];
  }
};

export const bookInstallationService = async (bookingData) => {
  return await axios.post(`${API_BASE}/installations/book`, bookingData);
};

export const trackOrder = async (orderNumber) => {
  return await axios.get(`${API_BASE}/tracking/order/${orderNumber}`);
};

export const trackInstallation = async (bookingNumber) => {
  return await axios.get(`${API_BASE}/tracking/installation/${bookingNumber}`);
};

export const submitSupportTicket = async (ticketData) => {
  return await axios.post(`${API_BASE}/support/ticket`, ticketData);
};
