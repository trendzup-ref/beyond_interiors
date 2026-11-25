import axios from "axios";
import axiosClient from "./axiosClient.js";

/**
 * Customer Management APIs for Beyond Interiors (Admin)
 */
export const getCustomers = async (params) => {
  return await axiosClient.get("/admin/customers", { params });
};

export const getCustomer = async (id) => {
  return await axiosClient.get(`/admin/customers/${id}`);
};

export const updateCustomerStatus = async (id, status) => {
  return await axiosClient.patch(`/admin/customers/${id}/status`, { status });
};

/**
 * Public Customer Storefront APIs (Installations, Tracking, Support)
 */
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

export default {
  getCustomers,
  getCustomer,
  updateCustomerStatus,
  getInstallationServices,
  bookInstallationService,
  trackOrder,
  trackInstallation,
  submitSupportTicket,
};
