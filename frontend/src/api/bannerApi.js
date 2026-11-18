import axiosClient from "./axiosClient.js";

export const getBanners = async (params) => {
  return await axiosClient.get("/admin/banners", { params });
};

export const getBanner = async (id) => {
  return await axiosClient.get(`/admin/banners/${id}`);
};

export const createBanner = async (data) => {
  const isFormData = data instanceof FormData;
  return await axiosClient.post("/admin/banners", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
};

export const updateBanner = async (id, data) => {
  const isFormData = data instanceof FormData;
  return await axiosClient.put(`/admin/banners/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
};

export const deleteBanner = async (id) => {
  return await axiosClient.delete(`/admin/banners/${id}`);
};

export const toggleBannerStatus = async (id) => {
  return await axiosClient.patch(`/admin/banners/${id}/toggle-status`);
};

export const reorderBanners = async (orderings) => {
  return await axiosClient.put("/admin/banners/reorder", { orderings });
};

export const getFeaturedProducts = async () => {
  return await axiosClient.get("/admin/banners/featured-products");
};

export const toggleFeaturedProduct = async (id, isFeatured) => {
  return await axiosClient.patch(`/admin/banners/featured-products/${id}`, {
    isFeatured,
  });
};

export default {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  reorderBanners,
  getFeaturedProducts,
  toggleFeaturedProduct,
};
