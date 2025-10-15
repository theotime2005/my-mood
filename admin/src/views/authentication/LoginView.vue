<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { loginUser } from "@/adapters/api-adapter.js";
import { saveLogin } from "@/utils/storage.js";

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

async function handleLogin() {
  const request = await loginUser({ email: email.value, password: password.value });
  if (request && request.token) {
    saveLogin(request.token);
    router.push({ name: "users" });
  } else if (request.error) {
    error.value = request.error;
  }
}
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">
      Connexion
    </h1>
    <form
      class="login-form"
      @submit.prevent="handleLogin"
    >
      <div class="form-group">
        <label
          for="email"
          class="form-label"
        >Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="form-input"
        >
      </div>
      <div class="form-group">
        <label
          for="password"
          class="form-label"
        >Mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="form-input"
        >
      </div>
      <button
        type="submit"
        class="login-button"
      >
        Se connecter
      </button>
      <p
        v-if="error"
        role="alert"
        class="error-message"
      >
        {{ error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
}
.login-title {
  margin-bottom: 2rem;
  color: #222f3e;
  font-size: 2.2rem;
  font-weight: 700;
}
.login-form {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.08);
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-label {
  font-weight: 500;
  color: #576574;
}
.form-input {
  padding: 0.7rem 1rem;
  border: 1px solid #c8d6e5;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s;
}
.form-input:focus {
  border-color: #54a0ff;
  outline: none;
}
.login-button {
  background: #54a0ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-button:hover {
  background: #2e86de;
}
.error-message {
  color: #ee5253;
  margin-top: 0.5rem;
  font-size: 1rem;
  text-align: center;
}
</style>
