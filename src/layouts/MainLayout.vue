<template>
  <q-layout view="hHh Lpr fFf" class="">

    <q-header v-model="header">
      <q-bar dark class="bg-grey-9 text-white">
        

        <q-btn flat size="xs" round color="white" icon="logout" @click="logout">
          <q-tooltip>
            Выход пользователя<br><b>{{ user.lastname }} {{ user.firstname }} {{ user.middlename }}</b>
          </q-tooltip>
        </q-btn>

        <q-space />
        <div class="col text-center text-grey-5">
          <b>ЕИС:</b> Клиент уведомлений
          <q-chip label="1.0.7" size="sm" /> <!-- ВЕРСИЯ -->
        </div>
        <!-- <q-btn flat size="xs" round icon="message"  @click="onClick" /> --> <!-- test -->
        
        <q-btn flat round icon="close" size="xs" color="white" @click="close" />
      </q-bar>
    </q-header>

    <q-footer v-model="footer" class="bg-transparent">
      <div class="text-right text-grey-5 q-pr-md bg-transparent" style="font-size: .6em;">
        &copy;2021 АО "КодимБезБоли"
      </div>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-img class="absolute-center full-height bg-index"
      src="images/login.jpg"
      no-spinner
    />
  </q-layout>
</template>

<script>
import { user, authenticated, logout } from 'src/api/auth'
import { notify } from 'src/api/listeners'

export default {
  setup() {
    return {
      footer: true,
      header: true,
      user,
      authenticated,

      logout,
      close: () => {
        appWindowApi.close()
      },
      // onClick: () => {
      //   notify ({
      //     title: 'this is title',
      //     body: 'but it s a body'
      //   })
      // }
    }
  }
}
</script>

<style lang="sass" scoped>
.bg-index
  z-index: -1
  filter: grayscale(100%) brightness(.3) blur(1px)
</style>