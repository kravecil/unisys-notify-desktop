import { api } from "src/boot/axios";
import { hosts } from "src/api/hosts";
import { enable, disable } from 'src/api/listeners'
import { ref } from "vue";

export const authenticated = ref(false);
export const user = ref({});
export const router = ref(null)

export async function authenticate() {
  console.log('authenticate');

  const token = window.localStorage.getItem("token");
  if (!token) {
    unauthenticate()

    return false
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  authenticated.value = true;

  const response = await api.get(hosts.auth + "api/user")
  user.value = response.data
  
  enable()
  appUtil.trayLoggedIn(true)
  
  return authenticated.value
}

export function unauthenticate() {
  window.localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];

  disable()
  appUtil.trayLoggedIn(false)
  // console.log('logEvent from auth');

  authenticated.value = false;
  user.value = {}

  // console.log(router);
  router.value.push({name: 'login'})

  console.log('unauthenticate');
}

export async function login (payload) {
  if (authenticated.value) return

  payload.device = 'notification_desktop'
  const response = await api.post(hosts.auth + 'api/login', payload)
  const token = response.data.token
  window.localStorage.setItem('token', token)
  await authenticate()

  console.log('login');
  return authenticated.value
}

export async function logout () {
  await api.delete(hosts.auth + 'api/logout')
  unauthenticate()

  return true
}