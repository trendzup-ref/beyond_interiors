import axiosClient from "./axiosClient.js";

// Professionals API
export const getProfessionals = async (params) => {
  return await axiosClient.get("/admin/professionals", { params });
};

export const createProfessional = async (data) => {
  return await axiosClient.post("/admin/professionals", data);
};

export const updateProfessional = async (id, data) => {
  return await axiosClient.put(`/admin/professionals/${id}`, data);
};

export const deleteProfessional = async (id) => {
  return await axiosClient.delete(`/admin/professionals/${id}`);
};

// Installation Bookings API
export const getInstallations = async (params) => {
  return await axiosClient.get("/admin/installations", { params });
};

export const getInstallation = async (id) => {
  return await axiosClient.get(`/admin/installations/${id}`);
};

export const assignProfessional = async (id, data) => {
  return await axiosClient.patch(`/admin/installations/${id}/assign`, data);
};

export const updateInstallationStatus = async (id, status) => {
  return await axiosClient.patch(`/admin/installations/${id}/status`, { status });
};

export default {
  getProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getInstallations,
  getInstallation,
  assignProfessional,
  updateInstallationStatus,
};
