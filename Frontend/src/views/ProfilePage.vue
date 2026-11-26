<template>
  <v-container class="mt-6">
    <h1 class="text-h4 mb-6">Личный кабинет</h1>
    
    <v-alert v-if="!currentUser" type="warning" class="mb-4">
      Вы не авторизованы. <router-link to="/">На главную</router-link>
    </v-alert>

    <div v-else>
      <v-tabs v-model="tab" color="primary" class="mb-4">
        <v-tab value="active">Активные брони</v-tab>
        <v-tab value="history">История</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- АКТИВНЫЕ БРОНИ -->
        <v-window-item value="active">
          <v-alert v-if="activeBookings.length === 0" type="info">Нет активных бронирований.</v-alert>
          <v-table v-else class="border rounded">
            <thead>
              <tr>
                <th>Мероприятие / Сеанс</th>
                <th>Дата брони</th>
                <th>Билеты</th>
                <th>Сумма</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in activeBookings" :key="b.id">
                <td>
                  <div><strong>{{ getEventTitle(b.eventId) }}</strong></div>
                  <div class="text-caption text-grey">{{ getSessionInfo(b) }}</div>
                </td>
                <td>{{ b.createdAt }}</td>
                <td>
                  <v-text-field v-model="b.seats" type="number" min="1" density="compact" variant="outlined" hide-details style="max-width: 90px;"></v-text-field>
                </td>
                <td><strong>{{ getTotalPrice(b) }} ₽</strong></td>
                <td>
                  <div class="d-flex align-center">
                    <v-btn color="primary" size="small" class="mr-2" @click="updateBooking(b)">Изменить</v-btn>
                    <v-btn color="warning" size="small" @click="cancelBooking(b)">Отменить</v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>

        <!-- ИСТОРИЯ -->
        <v-window-item value="history">
          <v-alert v-if="historyBookings.length === 0" type="info">История пуста.</v-alert>
          <v-table v-else class="border rounded text-grey">
            <thead>
              <tr>
                <th>Мероприятие / Сеанс</th>
                <th>Дата брони</th>
                <th>Билеты</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in historyBookings" :key="b.id">
                <td>
                  <div>{{ getEventTitle(b.eventId) }}</div>
                  <div class="text-caption">{{ getSessionInfo(b) }}</div>
                </td>
                <td>{{ b.createdAt }}</td>
                <td>{{ b.seats }}</td>
                <td>{{ getTotalPrice(b) }} ₽</td>
                <td><v-chip color="error" size="small">Отменено</v-chip></td>
                <td>
                  <v-btn color="error" size="small" variant="text" @click="deleteFromHistory(b.id)">Удалить</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const currentUser = JSON.parse(sessionStorage.getItem('user'));
const bookings = ref([]);
const events = ref([]);
const tab = ref('active');

const activeBookings = computed(() => bookings.value.filter(b => b.status === 'active'));
const historyBookings = computed(() => bookings.value.filter(b => b.status === 'cancelled'));

const loadData = async () => {
  if (!currentUser) return;
  try {
    const resBookings = await fetch(`http://localhost:3010/api/events/bookings/${currentUser.id}`);
    bookings.value = await resBookings.json();

    const resEvents = await fetch('http://localhost:3010/api/events');
    events.value = await resEvents.json();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};

const getEventTitle = (eventId) => {
  const event = events.value.find(e => e.id === eventId);
  return event ? event.title : 'Неизвестно';
};

const getSessionInfo = (booking) => {
  const event = events.value.find(e => e.id === booking.eventId);
  if (!event || !event.sessions) return '';
  const session = event.sessions.find(s => s.id === booking.sessionId);
  return session ? `${session.date} в ${session.time} (${session.hall})` : '';
};

const getTotalPrice = (booking) => {
  const event = events.value.find(e => e.id === booking.eventId);
  if (!event || !event.sessions) return 0;
  const session = event.sessions.find(s => s.id === booking.sessionId);
  return session ? (session.price * Number(booking.seats)) : 0;
};

const updateBooking = async (booking) => {
  try {
    const res = await fetch(`http://localhost:3010/api/events/bookings/${booking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seats: Number(booking.seats) })
    });
    if (res.ok) alert('Количество билетов обновлено!');
  } catch (error) { alert('Ошибка обновления'); }
};

const cancelBooking = async (booking) => {
  if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;
  try {
    const res = await fetch(`http://localhost:3010/api/events/bookings/${booking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
    if (res.ok) loadData(); 
  } catch (error) { alert('Ошибка отмены'); }
};

const deleteFromHistory = async (id) => {
  if (!confirm('Удалить из истории?')) return;
  try {
    const res = await fetch(`http://localhost:3010/api/events/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) loadData();
  } catch (error) { alert('Ошибка удаления'); }
};

onMounted(() => { loadData(); });
</script>