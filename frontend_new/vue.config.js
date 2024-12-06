const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081  // Установка порта, совпадающего с внешним портом в docker-compose.yml
  }
});