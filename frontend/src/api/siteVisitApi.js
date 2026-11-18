import axiosClient from "./axiosClient.js";

/**
 * Site Visit Management APIs for Beyond Interiors
 */
export const getSiteVisits = async (params) => {
  return await axiosClient.get("/admin/site-visits", { params });
};

export const getSiteVisit = async (id) => {
  return await axiosClient.get(`/admin/site-visits/${id}`);
};

export const scheduleVisit = async (id, data) => {
  return await axiosClient.patch(`/admin/site-visits/${id}/schedule`, data);
};

export const assignProfessionalToVisit = async (id, data) => {
  return await axiosClient.patch(`/admin/site-visits/${id}/assign`, data);
};

export const updateVisitStatus = async (id, status, remarks = "") => {
  return await axiosClient.patch(`/admin/site-visits/${id}/status`, {
    status,
    remarks,
  });
};

export default {
  getSiteVisits,
  getSiteVisit,
  scheduleVisit,
  assignProfessionalToVisit,
  updateVisitStatus,
};
