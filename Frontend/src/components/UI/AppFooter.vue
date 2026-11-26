<template>
  <!-- Класс mt-auto прижимает подвал к низу страницы, если контента мало -->
  <v-footer class="bg-grey-darken-4 text-white py-6 mt-auto">
    <v-container>
      <v-row>
        <!-- Колонка 1: Описание -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-2">Концерт-Холл «Арктика»</h3>
          <p class="text-body-2 text-grey-lighten-1">
            Крупнейшая концертная площадка Северодвинска. Проводим самые яркие музыкальные события города.
          </p>
        </v-col>

        <!-- Колонка 2: Контакты -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-2">Контакты</h3>
          <p class="text-body-2 text-grey-lighten-1 d-flex align-center mb-1">
            <v-icon size="small" class="mr-2">mdi-phone</v-icon> +7 (999) 123-45-67
          </p>
          <p class="text-body-2 text-grey-lighten-1 d-flex align-center">
            <v-icon size="small" class="mr-2">mdi-email</v-icon> info@arctic-hall.ru
          </p>
        </v-col>

        <!-- Колонка 3: Режим работы -->
        <v-col cols="12" md="4">
          <h3 class="text-h6 font-weight-bold mb-2">Режим работы</h3>
          <p class="text-body-2 text-grey-lighten-1 d-flex align-center mb-1">
            <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon> Кассы: ежедневно 10:00 – 20:00
          </p>
          <p class="text-body-2 text-grey-lighten-1 d-flex align-center">
            <v-icon size="small" class="mr-2">mdi-calendar</v-icon> Концерты: согласно афише
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-4 border-opacity-25"></v-divider>

      <!-- Копирайт -->
      <div class="text-center text-body-2 text-grey-lighten-1">
        © 2026 Концерт-Холл «Арктика». Все права защищены.
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
// Здесь логика не нужна, это просто статичный компонент
</script>