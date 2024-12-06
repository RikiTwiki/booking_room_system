import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import axios from 'axios';

// Настройка Axios
axios.defaults.baseURL = 'http://localhost:3000/api';
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Создание и настройка Vue приложения
const app = createApp(App);

// Добавление axios во все компоненты как $axios
app.config.globalProperties.$axios = axios;

// Использование vue-router
app.use(router);

// Монтирование приложения
app.mount('#app');