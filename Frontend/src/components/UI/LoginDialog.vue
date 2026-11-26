<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card class="pa-4">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="login">Вход</v-tab>
        <v-tab value="register">Регистрация</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="mt-4">
        <!-- Форма входа -->
        <v-window-item value="login">
          <v-text-field v-model="email" label="Email" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="password" label="Пароль" type="password" variant="outlined"></v-text-field>
          <v-btn color="primary" block class="mt-4" @click="login">Войти</v-btn>
        </v-window-item>

        <!-- Форма регистрации -->
        <v-window-item value="register">
          <v-text-field v-model="name" label="Имя" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="surname" label="Фамилия" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="email" label="Email" variant="outlined" class="mb-2"></v-text-field>
          <v-text-field v-model="password" label="Пароль" type="password" variant="outlined"></v-text-field>
          <v-btn color="success" block class="mt-4" @click="register">Зарегистрироваться</v-btn>
        </v-window-item>
      </v-window>
      
      <p v-if="error" class="text-error mt-2 text-center">{{ error }}</p>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
const tab = ref('login');
const email = ref('');
const password = ref('');
const name = ref('');
const surname = ref('');
const error = ref('');

// Открытие окна
const open = () => { dialog.value = true; error.value = ''; };
defineExpose({ open });

// Логин
const login = async () => {
  error.value = '';
  try {
    const res = await fetch('http://localhost:3010/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Сохраняем юзера в сессию
    sessionStorage.setItem('user', JSON.stringify(data.user));
    dialog.value = false;
    window.location.reload(); // Перезагружаем, чтобы шапка обновилась
  } catch (err) {
    error.value = err.message;
  }
};

// Регистрация
const register = async () => {
  error.value = '';
  try {
    const res = await fetch('http://localhost:3010/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: name.value, surname: surname.value, 
        email: email.value, password: password.value 
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    sessionStorage.setItem('user', JSON.stringify(data.user));
    dialog.value = false;
    window.location.reload();
  } catch (err) {
    error.value = err.message;
  }
};
</script>