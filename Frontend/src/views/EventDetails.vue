<template>
  <v-container v-if="event" class="mt-6">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">Назад к афише</v-btn>

    <v-row>
      <v-col cols="12" md="4">
        <v-img :src="event.image" height="300px" cover class="rounded-lg"></v-img>
      </v-col>

      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold mb-2">{{ event.title }}</h1>
        <p class="text-h6 text-grey-darken-1 mb-4">{{ event.artist }}</p>
        
        <v-divider class="my-4"></v-divider>

        <div class="text-body-1 mb-4">
          <v-icon class="mr-2">mdi-text</v-icon> <b>Описание:</b> {{ event.description }}
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Блок выбора сеанса -->
        <h3 class="text-h6 font-weight-bold mb-2">Выберите сеанс</h3>
        
        <div v-if="event.sessions && event.sessions.length > 0" class="d-flex flex-wrap mb-4">
          <v-btn 
            v-for="s in event.sessions" 
            :key="s.id"
            :color="selectedSession?.id === s.id ? 'primary' : 'default'"
            class="mr-2 mb-2"
            variant="outlined"
            @click="selectedSession = s"
          >
            <div class="text-left">
              <div>{{ s.date }} в {{ s.time }}</div>
              <div class="text-caption">{{ s.hall }} • {{ s.price }} ₽</div>
            </div>
          </v-btn>
        </div>
        <v-alert v-else type="info" class="mb-4">Сеансы еще не назначены</v-alert>

        <!-- Блок бронирования (показываем только если выбран сеанс) -->
        <div v-if="selectedSession">
          <h3 class="text-h6 font-weight-bold mb-2 mt-6">Бронирование</h3>
          <v-row class="align-center">
            <v-col cols="12" sm="4">
              <v-text-field 
                v-model="seats" 
                label="Кол-во билетов" 
                type="number" 
                min="1" 
                variant="outlined" 
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="8">
              <p class="text-h6 text-primary mb-2">Итого к оплате: {{ selectedSession.price * seats }} ₽</p>
              <v-btn color="primary" size="large" @click="bookTicket">Забронировать</v-btn>
            </v-col>
          </v-row>
          <p v-if="message" :class="isError ? 'text-error' : 'text-success'" class="mt-2 font-weight-bold">{{ message }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const event = ref(null);
const selectedSession = ref(null);
const seats = ref(1);
const message = ref('');
const isError = ref(false);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3010/api/events');
    const events = await response.json();
    event.value = events.find(e => e.id === route.params.id);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
});

const bookTicket = async () => {
  message.value = '';
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  
  if (!currentUser) {
    message.value = 'Пожалуйста, войдите в систему!';
    isError.value = true;
    return;
  }

  try {
    const response = await fetch('http://localhost:3010/api/events/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUser.id, 
        eventId: event.value.id, 
        sessionId: selectedSession.value.id,
        seats: Number(seats.value) 
      })
    });
    
    if (response.ok) {
      message.value = 'Билеты успешно забронированы!';
      isError.value = false;
    }
  } catch (error) {
    message.value = 'Ошибка при бронировании';
    isError.value = true;
  }
};
</script>