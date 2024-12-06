# Используем официальный образ Node.js 18
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости, включая devDependencies
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

# Открываем порт для фронтенда
EXPOSE 8081

# Команда для запуска сервера разработки
CMD ["npm", "run", "serve"]