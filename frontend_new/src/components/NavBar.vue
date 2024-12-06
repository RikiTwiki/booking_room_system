<template>
    <nav class="navbar">
      <button @click="goTo('/')" :disabled="$route.path === '/'">Home</button>
      <button v-if="!isAuthenticated" @click="goTo('/login')" :disabled="$route.path === '/login'">Login</button>
      <button v-if="!isAuthenticated" @click="goTo('/register')" :disabled="$route.path === '/register'">Register</button>
      <button v-if="isAuthenticated" @click="logout">Exit</button>
      <button v-if="isAuthenticated" @click="goTo('/add-room')" :disabled="$route.path === '/add-room'">Add Room</button>
      <button v-if="isAuthenticated" @click="goTo('/add-booking')" :disabled="$route.path === '/add-booking'">Add Booking</button>
      <button v-if="isAdmin" @click="goTo('/users')" :disabled="$route.path === '/users'">Users</button>
    </nav>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        isAdmin: false, // Роль администратора
      };
    },
    computed: {
      // Проверяем, авторизован ли пользователь
      isAuthenticated() {
        return !!localStorage.getItem("authToken");
      },
    },
    async created() {
        const token = localStorage.getItem("authToken");
        if (token) {
        try {
            // Вызываем новый API для проверки роли администратора
            const response = await axios.get("/auth/admin", {
            headers: { Authorization: `Bearer ${token}` },
            });
            this.isAdmin = response.data.isAdmin; 
        } catch (error) {
            console.error("Error checking admin status:", error.message);
        }
      }
    },
    methods: {
      goTo(route) {
        this.$router.push(route);
      },
      logout() {
        
        localStorage.removeItem("authToken");
        this.isAdmin = false;
        this.$router.push("/login");
      },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 10px 20px;
    background-color: #2c3e50;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  button:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
  
  button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  
  .navbar button {
    text-transform: uppercase;
  }
  </style>  