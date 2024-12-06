<template>
    <div>
      <h1>Register New Account</h1>
      <form @submit.prevent="register">
        <input type="text" v-model="username" placeholder="Username" required>
        <input type="email" v-model="email" placeholder="Email" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserRegister',
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
        async register() {
            const userData = {
                username: this.username,
                email: this.email,
                password: this.password
            };
            try {
                const response = await this.$axios.post('/auth/register', userData);

                console.log("Sending data:", userData);

                console.log(response.data);
                this.$router.push('/login');
            } catch (error) {
                if (error.response) {
                console.error('Failed to register:', error.response.data);
                } else {
                console.error('Error during registration:', error.message);
                }
            }
        }
    }
  }
  </script>  
  
  <style scoped>
  /* Стилизация для компонента Register */
  h1 {
    color: #2c3e50;
  }
  </style>  