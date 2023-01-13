<template>
  <q-page padding  class="flex flex-center">
    <div class="bg-white q-pa-lg rounded-borders">
      <div class="text-h6">Пожалуйста, авторизуйтесь</div>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input dense color="deep-orange-10" v-model="username" type="text" label="логин" />
        <q-input dense color="deep-orange-10" v-model="password" type="password" label="пароль" />
        <div>
          <q-btn size="sm" label="Войти" type="submit" color="deep-orange-10"/>
          <q-btn size="sm" label="Сбросить" type="reset" color="deep-orange-10" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { login } from 'src/api/auth'

export default {
  setup() {
    const router = useRouter()

    const username = ref(null)
    const password = ref(null)

    return {
      username,
      password,

      onSubmit: async () =>  {
        const result = await login({
          username: username.value,
          password: password.value
        })

        console.log(result);
        if (result) router.push({name: 'index'})
      },
      onReset: () => {
        username.value = null,
        password.value = null
      }
    }
  }
}
</script>
