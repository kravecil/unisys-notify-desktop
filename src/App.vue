<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { authenticate, router } from 'src/api/auth'

export default defineComponent({
  name: "App",
  setup () {
    onMounted(() => {
      router.value = useRouter()
      authenticate()
    })
  }
});
</script>
