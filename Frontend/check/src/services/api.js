import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

const productFormData = (product, image) => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  return formData;
};

export const imageUrl = (product) => {
  if (!product?.hasImage || !product?.id) {
    return null;
  }
  return `${API_BASE_URL}/api/products/${product.id}/image`;
};

export const productApi = {
  async list() {
    const { data } = await api.get('/products');
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async search(keyword) {
    const { data } = await api.get('/products/search', { params: { keyword } });
    return data;
  },

  async create(product, image) {
    const { data } = await api.post('/products', productFormData(product, image));
    return data;
  },

  async update(id, product, image) {
    const { data } = await api.put(`/products/${id}`, productFormData(product, image));
    return data;
  },

  async remove(id) {
    await api.delete(`/products/${id}`);
  },
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const response = error?.response?.data;
  if (response?.validationErrors && Object.keys(response.validationErrors).length > 0) {
    return Object.values(response.validationErrors).join(' ');
  }
  return response?.message ?? error?.message ?? fallback;
};