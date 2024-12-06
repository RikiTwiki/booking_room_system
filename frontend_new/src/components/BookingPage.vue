<template>
    <div class="booking-container">
      <h1>Book a Room</h1>
      <form @submit.prevent="bookRoom" class="booking-form">
        <label for="room">Room:</label>
        <select v-model="roomId" id="room" required>
          <option disabled value="">Select a Room</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
        </select>
  
        <label for="start-time">Start Time:</label>
        <input id="start-time" v-model="startTime" type="datetime-local" required />
  
        <label for="end-time">End Time:</label>
        <input id="end-time" v-model="endTime" type="datetime-local" required />
  
        <label for="reason">Reason:</label>
        <textarea id="reason" v-model="reason" placeholder="Reason for booking" required></textarea>
  
        <button type="submit" class="submit-button">Book Room</button>
      </form>
  
      <p v-if="message" class="message">{{ message }}</p>
  
      <h2>My Bookings</h2>
      <ul class="bookings-list">
        <li v-for="booking in bookings" :key="booking.id" class="booking-item">
          <strong>{{ booking.room_name }}</strong> - 
          {{ formatDate(booking.start_time) }} to {{ formatDate(booking.end_time) }}:
          <em>{{ booking.reason }}</em>
        </li>
      </ul>
  
      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="changePage(page - 1)" :disabled="page === 1" class="pagination-button">Previous</button>
        <span class="pagination-info">Page {{ page }} of {{ totalPages }}</span>
        <button @click="changePage(page + 1)" :disabled="page === totalPages" class="pagination-button">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { format } from 'date-fns';
  
  export default {
    data() {
      return {
        rooms: [],
        roomId: '',
        startTime: '',
        endTime: '',
        reason: '',
        message: '',
        bookings: [],
        page: 1, // Текущая страница
        totalPages: 1, // Количество страниц
      };
    },
    async created() {
      await this.fetchRooms();
      await this.fetchBookings();
    },
    methods: {
      async fetchRooms() {
        try {
          const response = await axios.get('/rooms'); // Получаем список залов
          this.rooms = response.data;
        } catch (error) {
          console.error('Error fetching rooms:', error.message);
        }
      },
  
      async fetchBookings() {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`/bookings?page=${this.page}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          this.bookings = response.data;
          this.totalPages = Math.ceil(response.data.totalCount / 10); // Пагинация
        } catch (error) {
          console.error('Error fetching bookings:', error.message);
        }
      },
  
      async bookRoom() {
        if (!this.roomId || !this.startTime || !this.endTime || !this.reason) {
          this.message = 'Please fill in all fields before booking.';
          return;
        }
  
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post(
            '/add-booking',
            {
              roomId: this.roomId,
              startTime: this.startTime,
              endTime: this.endTime,
              reason: this.reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          this.message = `Room booked successfully! Booking ID: ${response.data.id}`;
          this.fetchBookings(); 
        } catch (error) {
          console.error('Error booking room:', error.response?.data?.message || error.message);
          this.message = 'Failed to book the room. Please try again.';
        }
      },
  
      changePage(newPage) {
        this.page = newPage;
        this.fetchBookings(); // Загружаем данные для новой страницы
      },
  
      formatDate(dateString) {
        return format(new Date(dateString), 'MMMM d, yyyy, h:mm a');
      },
    },
  };
  </script>
  
  <style scoped>
  .booking-container {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1, h2 {
    color: #333;
    text-align: center;
  }
  
  .booking-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .booking-form label {
    font-weight: bold;
  }
  
  .booking-form input, 
  .booking-form select, 
  .booking-form textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .bookings-list {
    list-style-type: none;
    padding: 0;
  }
  
  .booking-item {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  
  .pagination-button {
    background-color: #008cba;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .pagination-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .pagination-info {
    font-weight: bold;
  }
  
  .message {
    color: green;
    margin-top: 10px;
    text-align: center;
  }
  </style>  