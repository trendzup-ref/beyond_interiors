import axiosClient from "./axiosClient.js";

/**
 * Order & Offline Payment APIs for Beyond Interiors
 */
export const getOrders = async (params) => {
  return await axiosClient.get("/admin/orders", { params });
};

export const getOrder = async (id) => {
  return await axiosClient.get(`/admin/orders/${id}`);
};

export const updateOrderStatus = async (id, data) => {
  return await axiosClient.patch(`/admin/orders/${id}/status`, data);
};

export const updatePaymentRecord = async (id, data) => {
  return await axiosClient.patch(`/admin/orders/${id}/payment`, data);
};

export const cancelOrder = async (id, reason) => {
  return await axiosClient.post(`/admin/orders/${id}/cancel`, { reason });
};

export default {
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentRecord,
  cancelOrder,
};
