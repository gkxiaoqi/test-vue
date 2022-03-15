import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/pages/home"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
