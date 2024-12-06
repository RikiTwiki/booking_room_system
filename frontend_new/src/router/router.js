// Импорт createRouter и createWebHistory из vue-router
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/AppHome.vue';
import Login from '../components/UserLogin.vue';

import Register from '../components/UserRegister.vue';  // Импорт нового компонента

import AddRoomPage from '../components/AddRoomPage.vue';

import BookingPage from '../components/BookingPage.vue';

import Users from '../components/UsersPage.vue';

// Создание экземпляра роутера с использованием функции createRouter
const router = createRouter({
  history: createWebHistory(), // Используйте createWebHistory для использования истории браузера
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    { path: '/register',
      name: 'Register',
      component: Register
    },
    { path: '/add-room',
      name: 'AddRoom',
      component: AddRoomPage,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/add-booking',
      name: 'AddBooking',
      component: BookingPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ]
});

// Проверка аутентификации и роли перед переходом
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken'); // Проверяем токен
    let user = null;
  
    if (token) {
      try {
        // Расшифровываем JWT токен
        user = JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next('/login'); // Перенаправляем на страницу логина, если пользователь не авторизован
      } else if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (user?.role === 'admin') {
          next(); // Разрешаем доступ администратору
        } else {
          next('/'); // Перенаправляем на главную страницу, если пользователь не администратор
        }
      } else {
        next(); // Разрешаем доступ авторизованному пользователю
      }
    } else {
      next(); // Доступ открыт
    }
  });

// Экспорт роутера для использования в main.js
export default router;