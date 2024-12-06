<template>
    <div>
      <h1>Manage Users</h1>
      <button @click="openCreateModal">Create User</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="openEditModal(user)">Edit</button>
              <button @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Модальное окно создания и редактирования -->
      <div v-if="showModal" class="modal">
        <h2>{{ isEditing ? 'Edit User' : 'Create User' }}</h2>
        <form @submit.prevent="isEditing ? updateUser() : createUser()">
          <input v-model="formData.email" placeholder="Email" required />
          <input v-model="formData.password" placeholder="Password" :required="!isEditing" />
          <select v-model="formData.role" required>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit">{{ isEditing ? 'Save Changes' : 'Create User' }}</button>
        </form>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        showModal: false,
        isEditing: false,
        formData: { id: null, email: '', password: '', role: 'user' },
      };
    },
    async created() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
            this.$router.push('/login'); // Перенаправить на страницу логина, если токена нет
            return;
            }
    
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Расшифровать JWT токен
            this.isAdmin = decodedToken.role === 'admin';
    
            if (!this.isAdmin) {
            this.$router.push('/'); // Перенаправить, если пользователь не администратор
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            this.$router.push('/login'); // Перенаправить в случае ошибки
        }
    },
    methods: {
        async fetchUsers() {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/users', {  
            headers: { Authorization: `Bearer ${token}` },
            });
            this.users = response.data;
        },
        openCreateModal() {
            this.showModal = true;
            this.isEditing = false;
            this.formData = { id: null, email: '', password: '', role: 'user' };
        },
        openEditModal(user) {
            this.showModal = true;
            this.isEditing = true;
            this.formData = { id: user.id, email: user.email, role: user.role };
        },
        async createUser() {
            const token = localStorage.getItem('authToken');
            await axios.post('/users', this.formData, {  
            headers: { Authorization: `Bearer ${token}` },
            });
            this.closeModal();
            await this.fetchUsers();
        },
        async updateUser() {
            const token = localStorage.getItem('authToken');
            await axios.put(`/api/users/${this.formData.id}`, this.formData, {  
            headers: { Authorization: `Bearer ${token}` },
            });
            this.closeModal();
            await this.fetchUsers();
        },
        async deleteUser(id) {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/api/users/${id}`, {  
            headers: { Authorization: `Bearer ${token}` },
            });
            await this.fetchUsers();
        },
        closeModal() {
            this.showModal = false;
        },
      }
  };
  </script>
  
  <style scoped>
  
  </style>  