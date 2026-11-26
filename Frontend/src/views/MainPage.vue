<template>
  <v-container>
    <h1 class="text-h4 mb-4">Афиша концертов</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="event in events" :key="event.id">
        <v-card :to="`/event/${event.id}`" hover class="h-100">
          <v-img :src="event.image" height="200px" cover></v-img>
          <v-card-title>{{ event.title }}</v-card-title>
          
          <v-card-subtitle>
            <span v-if="event.sessions && event.sessions.length > 0">
              Ближайший: {{ event.sessions[0].date }} в {{ event.sessions[0].time }}
            </span>
            <span v-else class="text-error">Билеты скоро в продаже</span>
          </v-card-subtitle>
          
          <v-card-text>
            <p class="mb-2">{{ event.artist }}</p>
            <h3 class="text-h6 font-weight-bold" v-if="event.sessions && event.sessions.length > 0">
              от {{ event.sessions[0].price }} ₽
            </h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const events = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3010/api/events');
    events.value = await response.json();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
});
</script>
