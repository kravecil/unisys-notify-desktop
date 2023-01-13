<template>
<q-page padding class="row justify-center">
  <div
    v-if="notifications.length == 0"
    class="col row text-white justify-center items-center"
  >
    Новые уведомления&nbsp;<span class="text-weight-bold">отсутствуют</span>.
  </div>
  <q-carousel
    v-if="notifications.length > 0"
    v-model="slide"
    transition-prev="jump-right"
    transition-next="jump-left"
    swipeable
    animated
    control-color="white"
    prev-icon="arrow_left"
    next-icon="arrow_right"
    padding
    arrows
    class="bg-transparent text-white col" style="height: calc(100vh - 100px)"
  >
    <q-carousel-slide
      v-for="(notification, index) in notifications" :key="index"
      :name="index" class="row items-center q-gutter-x-lg"
    >
      <q-icon name="message" size="xl" />
      <div class="column col">

        <!-- дата и пользователь -->
        <div class="row text-grey-6" style="font-size: 0.8em">
          {{ date.formatDate(notification.datetime, 'D.MM.YYYY') }}
            <div v-if="notification.user" class="text-deep-orange-10">&nbsp;|&nbsp;<b>{{notification.user?.fullname}}</b></div>
        </div>

        <!-- заголовок -->
        <div class="text-h6">{{ notification.title }}</div>

        <!-- тело -->
        <q-item-label caption :lines="3" class="text-grey-5">{{ notification.message }}</q-item-label>

        <q-separator spaced color="grey-5" />

        <!-- ссылка -->
        <div v-if="notification.link" class="text-grey-6 cursor-pointer" @click="openLink(notification.link)">
          {{notification.link}}
        </div>

      </div>
    </q-carousel-slide>

    <template v-slot:control>
      <q-carousel-control
        class="row items-center q-px-lg"
        position="bottom"
        :offset="[0, 0]"
      >
        <q-btn flat :icon="defer?'do_not_disturb_on' : 'do_not_disturb_off'" dense>
          <q-tooltip anchor="center right" self="center left">Режим "не беспокоить"</q-tooltip>
          <q-menu dense>
            <q-list dense>
              <q-item clickable v-close-popup @click="doNotDisturb()">
                <q-item-section avatar><q-icon name="do_not_disturb_off" /></q-item-section>
                <q-item-section>отменить</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="doNotDisturb(10)">
                <q-item-section avatar><q-icon name="do_not_disturb_on" /></q-item-section>
                <q-item-section>10 минут</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="doNotDisturb(60)">
                <q-item-section avatar><q-icon name="do_not_disturb_on" /></q-item-section>
                <q-item-section>1 час</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="doNotDisturb(180)">
                <q-item-section avatar><q-icon name="do_not_disturb_on" /></q-item-section>
                <q-item-section>3 часа</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat icon="clear" @click="clear" dense>
          <q-tooltip anchor="center right" self="center left">Очистить историю</q-tooltip>
        </q-btn><q-space />
        <div class="text-weight-bold">{{ slide + 1 }} / {{ notifications.length }}</div>
      </q-carousel-control>
    </template>
  </q-carousel>

</q-page>
</template>

<script setup>
// import { ipcRenderer } from 'electron/renderer'
import { ref, watch } from "vue";
import { date } from 'quasar'

import { logout, user } from 'src/api/auth'
import { notifications, slide, defer } from 'src/api/store'
import { clear } from 'src/api/listeners'

//console.log(process.env.APP_URL)

const onLogout = () => {
  logout()
}
const openLink = (link) => {
  appUtil.openLink(link)
}

const doNotDisturb = (minutes) => {
  if (minutes) {
    defer.value = date.addToDate(new Date(), { minutes: minutes })
    appWindowApi.close()
  } else defer.value = null
}

</script>
