<template>
  <!-- Добавили песочный фон для всего приложения -->
  <v-app class="d-flex flex-column min-vh-100" style="background-color: #f5ebe0;">
    
    <!-- Бордовая шапка -->
    <v-app-bar color="#800020" dark flat>
      <v-toolbar-title class="cursor-pointer font-weight-bold" @click="$router.push('/')">
        Концерт-Холл «Арктика»
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-if="currentUser" class="d-flex align-center">
        <v-btn to="/profile" variant="text" class="mr-2">Личный кабинет</v-btn>
        <span class="mr-4">{{ currentUser.name }}</span>
        <v-btn variant="outlined" color="white" @click="logout">Выйти</v-btn>
      </div>
      
      <!-- Кнопка Войти (тоже сделаем в тон) -->
      <v-btn v-else variant="outlined" color="white" @click="loginRef.open()">Войти</v-btn>

      <LoginDialog ref="loginRef" />
    </v-app-bar>

    <!-- Основной контент (фон песочный, так как задан в v-app) -->
    <v-main class="flex-grow-1">
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import LoginDialog from './components/UI/LoginDialog.vue';
import AppFooter from './components/UI/AppFooter.vue';

const loginRef = ref(null);
const currentUser = ref(JSON.parse(sessionStorage.getItem('user')));

const logout = () => {
  sessionStorage.removeItem('user');
  currentUser.value = null;
  window.location.reload();
};
</script>

<style>
.min-vh-100 {
  min-height: 100vh;
}
</style>
