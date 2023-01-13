import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import { unauthenticate } from "src/api/auth";

const api = axios.create({
  // baseURL: hosts.api,
  // timeout: 5000,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) unauthenticate();
    if (error.response.status === 403) unauthenticate();

    Notify.create({
      type: "negative",
      message: `<strong>Ошибка: ${error.response.status}</strong><br>${error.message}`,
      html: true,
    });

    console.log(error);

    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api, axios };
