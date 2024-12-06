<template>
    <div class="container">
      <h1 class="title">Add New Room</h1>
      <form @submit.prevent="addRoom" v-if="isAdmin" class="form">
        <div class="form-group">
          <label for="name">Room Name</label>
          <input v-model="name" id="name" type="text" placeholder="Enter room name" required />
        </div>
        <div class="form-group">
          <label for="description">Room Description</label>
          <textarea
            v-model="description"
            id="description"
            placeholder="Enter room description"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn">Add Room</button>
      </form>
      <p v-if="message" :class="{'message-success': success, 'message-error': !success}">{{ message }}</p>
      <p v-else-if="!isAdmin" class="error">
        Access denied. This page is for administrators only.
      </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        description: '',
        message: '',
        success: false, // Tracks success or error state
        isAdmin: false, // Checks if the user is an admin
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login'); // Redirect to login if no token
          return;
        }
  
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        this.isAdmin = decodedToken.role === 'admin';
  
        if (!this.isAdmin) {
          this.$router.push('/'); // Redirect if not admin
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.$router.push('/login'); // Redirect to login on error
      }
    },
    methods: {
      async addRoom() {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post(
            '/add-rooms',
            { name: this.name, description: this.description },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          // Display success message
          this.success = true;
          this.message = `Room "${response.data.name}" added successfully!`;
          this.name = '';
          this.description = '';
        } catch (error) {
          console.error('Error adding room:', error.response?.data?.message || error.message);
          this.success = false;
          this.message = 'Failed to add room. Please try again.';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    outline: none;
  }
  
  input:focus,
  textarea:focus {
    border-color: #007bff;
  }
  
  .btn {
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    font-size: 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .message-success {
    color: green;
    margin-top: 10px;
    font-weight: bold;
  }
  
  .message-error {
    color: red;
    margin-top: 10px;
    font-weight: bold;
  }
  
  .error {
    color: red;
    margin-top: 20px;
    text-align: center;
    font-weight: bold;
  }
  </style>  