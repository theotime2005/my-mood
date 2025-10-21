import { createRouter, createWebHashHistory } from "vue-router";

import { getLogin } from "@/utils/storage.js";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/views/authentication/LoginView.vue"),
      meta: {
        pageName: "Connexion",
      },
    },
    {
      path: "/users",
      name: "users",
      component: () => import("@/views/users/UsersView.vue"),
      meta: {
        requireAuth: true,
        pageName: "Utilisateurs de My mood",
      },
    },
  ],
});

router.beforeEach((to) => {
  const requiresAuth = Boolean(to.meta && to.meta.requireAuth);
  const isAuthenticated = Boolean(getLogin());

  if (requiresAuth && !isAuthenticated) {
    return { name: "login" };
  }
  return true;
});

router.afterEach((to) => {
  document.title = `${to.meta.pageName} | My Mood Manager`;
});

export default router;
