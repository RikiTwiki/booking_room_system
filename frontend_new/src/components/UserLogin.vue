<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: this.email,
            password: this.password,
          });
          localStorage.setItem('authToken', response.data.token); // Сохраняем токен
          this.$router.push('/'); // Перенаправляем на главную страницу
        } catch (error) {
          alert('Login failed: ' + error.response.data.message);
        }
      },
    },
  };
  </script>  