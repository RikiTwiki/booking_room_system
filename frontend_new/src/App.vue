<template>
  <div id="app">
    <NavBar /> <!-- Добавляем навигационную панель -->
    <router-view /> <!-- Отображение текущей страницы -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  components: {
    NavBar,
  },
};
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f9fa;
}
</style>