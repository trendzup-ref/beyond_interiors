import axiosClient from "./axiosClient.js";

export const getProducts = async (params) => {
  return await axiosClient.get("/admin/products", { params });
};

export const getProduct = async (id) => {
  return await axiosClient.get(`/admin/products/${id}`);
};

export const createProduct = async (data) => {
  return await axiosClient.post("/admin/products", data);
};

export const updateProduct = async (id, data) => {
  return await axiosClient.put(`/admin/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await axiosClient.delete(`/admin/products/${id}`);
};

export const updateStock = async (id, payload) => {
  return await axiosClient.patch(`/admin/products/${id}/stock`, payload);
};

export const uploadProductImages = async (formData) => {
  return await axiosClient.post("/admin/products/upload-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImages,
};
