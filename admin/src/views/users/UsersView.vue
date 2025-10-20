<script setup>
import { onMounted, reactive, ref } from "vue";

import { getAllUsers } from "@/adapters/api-adapter.js";
import { updateUserType } from "@/adapters/api-adapter.js";
import { USER_TYPE } from "@/constants";
import { getLogin } from "@/utils/storage.js";

const usersData = ref([]);
const selectedTypes = reactive({});
const updatingId = ref(null);

const USER_TYPE_VALUES = Object.values(USER_TYPE);

onMounted(async () => {
  const token = getLogin();
  try {
    const users = await getAllUsers(token);
    usersData.value = Array.isArray(users) ? users : [];
    usersData.value.forEach((u) => {
      selectedTypes[u.id] = u.userType ?? USER_TYPE_VALUES[0];
    });
  } catch {
    usersData.value = [];
  }
});

async function updateType(user) {
  const token = getLogin();
  const newType = selectedTypes[user.id];
  if (!newType || newType === user.userType) return;
  updatingId.value = user.id;
  const success = await updateUserType({ userId: user.id, token, userType: newType });
  if (success) {
    const idx = usersData.value.findIndex((u) => u.id === user.id);
    if (idx !== -1) usersData.value[idx].userType = newType;
  }
  updatingId.value = null;
}
</script>

<template>
  <div class="users-container">
    <h1 class="users-title">
      Gestion des utilisateurs
    </h1>

    <table
      v-if="usersData.length > 0"
      aria-label="Liste des utilisateurs"
      class="users-table"
    >
      <thead>
        <tr>
          <th>Prénom</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in usersData"
          :key="user.id"
        >
          <td data-label="Prénom">
            {{ user.firstname }}
          </td>
          <td data-label="Nom">
            {{ user.lastname }}
          </td>
          <td
            class="email-cell"
            data-label="Email"
          >
            {{ user.email }}
          </td>
          <td data-label="Rôle">
            {{ user.userType }}
          </td>
          <td
            class="actions-cell"
            data-label="Actions"
          >
            <select
              v-model="selectedTypes[user.id]"
              aria-label="Sélectionner le rôle"
              class="role-select"
            >
              <option
                v-for="type in USER_TYPE_VALUES"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
            <button
              class="update-button"
              :disabled="updatingId === user.id"
              @click="updateType(user)"
            >
              {{ updatingId === user.id ? "Mise à jour…" : "Mettre à jour" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p
      v-else
      class="no-users"
    >
      Aucun utilisateur trouvé.
    </p>
  </div>
</template>

<style scoped>
/* styles améliorés pour la vue utilisateurs */
.users-container {
  max-width: 1000px;
  margin: 24px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(50, 50, 93, 0.06);
  color: #1f2937; /* gray-800 */
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.users-title {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a; /* darker */
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 6px;
}

.users-table thead th {
  text-align: left;
  padding: 12px 16px;
  background: linear-gradient(180deg,#f8fafc,#f1f5f9);
  color: #0b1220;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.users-table tbody td {
  padding: 12px 16px;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.04);
  vertical-align: middle;
}

.users-table tbody tr:nth-child(even) {
  background: #fbfdff;
}

.users-table tbody tr:hover {
  background: #f1f5f9;
}

.email-cell {
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.9rem;
}

.update-button {
  padding: 7px 12px;
  background: linear-gradient(180deg,#0ea5a4,#059669);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
  box-shadow: 0 6px 12px rgba(5,150,105,0.12);
}

.update-button:hover:not([disabled]) {
  transform: translateY(-1px);
}

.update-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.no-users {
  text-align: center;
  padding: 24px 12px;
  color: #6b7280;
}

/* Responsive: on small screens, make the table more readable */
@media (max-width: 720px) {
  .users-container {
    padding: 12px;
  }
  .users-table thead {
    display: none;
  }
  .users-table, .users-table tbody, .users-table tr, .users-table td {
    display: block;
    width: 100%;
  }
  .users-table tr {
    margin-bottom: 12px;
    border-radius: 8px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(2,6,23,0.04);
  }
  .users-table td {
    padding: 8px 12px;
    border-bottom: none;
  }
  .users-table td::before {
    content: attr(data-label);
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    font-size: 0.82rem;
  }
}
</style>
