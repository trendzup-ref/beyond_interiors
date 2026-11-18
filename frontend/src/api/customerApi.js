import axiosClient from "./axiosClient.js";

/**
 * Customer Management APIs for Beyond Interiors
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

export default {
  getCustomers,
  getCustomer,
  updateCustomerStatus,
};
