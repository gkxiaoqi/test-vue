import app from "./app.vue";
import router from "./routes";
// vue3写法
import { createApp } from "vue";
createApp(app).use(router).mount("#app");

// vue2写法
// new Vue({ render: (h) => h(app) }).$mount("#app");
