import axiosClient from "./axiosClient.js";

// Categories API
export const getCategories = async (params) => {
  return await axiosClient.get("/admin/categories", { params });
};

export const getCategory = async (id) => {
  return await axiosClient.get(`/admin/categories/${id}`);
};

export const createCategory = async (data) => {
  return await axiosClient.post("/admin/categories", data);
};

export const updateCategory = async (id, data) => {
  return await axiosClient.put(`/admin/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axiosClient.delete(`/admin/categories/${id}`);
};

// Subcategories API
export const getSubcategories = async (params) => {
  return await axiosClient.get("/admin/subcategories", { params });
};

export const getSubcategory = async (id) => {
  return await axiosClient.get(`/admin/subcategories/${id}`);
};

export const createSubcategory = async (data) => {
  return await axiosClient.post("/admin/subcategories", data);
};

export const updateSubcategory = async (id, data) => {
  return await axiosClient.put(`/admin/subcategories/${id}`, data);
};

export const deleteSubcategory = async (id) => {
  return await axiosClient.delete(`/admin/subcategories/${id}`);
};

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
