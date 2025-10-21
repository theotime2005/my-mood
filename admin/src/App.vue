<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { checkApiIsOk, getUserInfo } from "@/adapters/api-adapter.js";
import { userData } from "@/stores/user.js";
import { getLogin, removeLogin } from "@/utils/storage.js";

const apiIsActive = ref(false);
const isLogged = ref(false);
const route = useRoute();
const router = useRouter();

function logout() {
  const confirm = window.confirm("Voulez-vous vraiment vous déconnecter ?");
  if (confirm) {
    removeLogin();
    router.push({ name: "login" });
  }
}

onMounted(async () => {
  apiIsActive.value = await checkApiIsOk();
  const token = getLogin();
  if (token && await getUserInfo(token)) {
    router.push({ name: "users" });
  }
});

watch(
  () => route.path,
  async () => {
    try {
      const login = getLogin();

      if (login) {
        isLogged.value = true;

        const info = await getUserInfo(login);
        if (info) {
          userData.value = info;
        }
      } else {
        isLogged.value = false;
        if (userData && typeof userData === "object" && "value" in userData) {
          userData.value = null;
        }
      }
    } catch {
      isLogged.value = false;
      if (userData && typeof userData === "object" && "value" in userData) {
        userData.value = null;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="apiIsActive">
    <header v-if="isLogged">
      <p>Connecté en tant que {{ userData.firstname }} {{ userData.lastname }}</p>
      <button @click="logout">
        Déconnexion
      </button>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  color: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 1px 4px rgba(16,24,40,0.06);
}

header p {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2px;
}

header button {
  background: #ffffff;
  color: #334155;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

header button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(59,130,246,0.18);
}

/* Make the main router content more readable */
:root, div {
  --content-max-width: 980px;
}

div[role="app-root"], div {
  max-width: var(--content-max-width);
  margin: 20px auto;
  padding: 0 16px;
}

/* Responsive tweaks */
@media (max-width: 600px) {
  header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    padding: 12px;
  }

  header button {
    width: 100%;
    text-align: center;
  }
}
</style>
