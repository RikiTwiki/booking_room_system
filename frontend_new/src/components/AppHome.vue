<template>
    <div class="booked-rooms-container">
      <h1 class="header">Booked Rooms</h1>
      
      <div v-if="rooms.length === 0" class="no-rooms">
        No rooms are booked currently.
      </div>
  
      
      <ul class="rooms-list">
        <li v-for="room in rooms" :key="room.id" @click="showRoomDetails(room)" class="room-item">
          {{ room.room_name }}
        </li>
      </ul>
  
      
      <div v-if="selectedRoom" class="modal">
        <div class="modal-content">
          <h2 class="room-name">{{ selectedRoom.name }}</h2>
          <p><strong>Author:</strong> {{ selectedRoom.user_email || 'N/A' }}</p> 
          <p><strong>Time:</strong> {{ formatDate(selectedRoom.start_time) }} to {{ formatDate(selectedRoom.end_time) }}</p> 
          <p><strong>Reason:</strong> {{ selectedRoom.reason }}</p>
          <button @click="selectedRoom = null" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        rooms: [],
        selectedRoom: null,
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/bookings', {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        this.rooms = response.data; 

        console.log("Response data:", this.rooms);

      } catch (error) {
        console.error('Error fetching booked rooms:', error);
        this.$router.push('/login'); 
      }
    },
    methods: {
      showRoomDetails(room) {

        console.log("Selected room details:", room);

        this.selectedRoom = room;

        console.log("Start time:", room.start_time); 
        console.log("End time:", room.end_time);

      },
  
      formatDate(dateString) {
        if (!dateString) {
            console.error("Invalid date string: ", dateString);  
            return 'No date provided';  
        }

        const formattedDateString = dateString.replace(' ', 'T');
        const date = new Date(formattedDateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date format:", dateString);
            return 'Invalid Date';
        }

        return date.toLocaleString();  
      }
    },
  };
  </script>
  
  <style scoped>
  .booked-rooms-container {
    padding: 20px;
  }
  
  .header {
    font-size: 2rem;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 20px;
  }
  
  .no-rooms {
    font-size: 1.2rem;
    color: #555;
  }
  
  .rooms-list {
    list-style: none;
    padding: 0;
  }
  
  .room-item {
    background-color: #f4f4f4;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .room-item:hover {
    background-color: #e0f7fa;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  .room-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4caf50;
  }
  
  button.close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button.close-btn:hover {
    background-color: #45a049;
  }
  </style>  