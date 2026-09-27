/**
 * Central API Barrel Export
 * Exposes all 13 decoupled API services and the base Axios client.
 */

export { default as axiosClient } from './axiosClient.js';
export { default as authApi, authApi as authService } from './authApi.js';
export { default as marketApi, marketApi as marketService } from './marketApi.js';
export { default as farmerApi, farmerApi as farmerService } from './farmerApi.js';
export { default as productApi, productApi as productService } from './productApi.js';
export { default as categoryApi, categoryApi as categoryService } from './categoryApi.js';
export { default as weeklyStockApi, weeklyStockApi as weeklyStockService } from './weeklyStockApi.js';
export { default as cartApi, cartApi as cartService } from './cartApi.js';
export { default as orderApi, orderApi as orderService } from './orderApi.js';
export { default as reviewApi, reviewApi as reviewService } from './reviewApi.js';
export { default as favoriteApi, favoriteApi as favoriteService } from './favoriteApi.js';
export { default as notificationApi, notificationApi as notificationService } from './notificationApi.js';
export { default as adminApi, adminApi as adminService } from './adminApi.js';
export { default as contactApi, contactApi as contactService } from './contactApi.js';

import axiosClient from './axiosClient.js';
import authApi from './authApi.js';
import marketApi from './marketApi.js';
import farmerApi from './farmerApi.js';
import productApi from './productApi.js';
import categoryApi from './categoryApi.js';
import weeklyStockApi from './weeklyStockApi.js';
import cartApi from './cartApi.js';
import orderApi from './orderApi.js';
import reviewApi from './reviewApi.js';
import favoriteApi from './favoriteApi.js';
import notificationApi from './notificationApi.js';
import adminApi from './adminApi.js';
import contactApi from './contactApi.js';

const api = {
  axiosClient,
  auth: authApi,
  markets: marketApi,
  farmers: farmerApi,
  products: productApi,
  categories: categoryApi,
  weeklyStock: weeklyStockApi,
  cart: cartApi,
  orders: orderApi,
  reviews: reviewApi,
  favorites: favoriteApi,
  notifications: notificationApi,
  admin: adminApi,
  contact: contactApi,
};

export default api;
