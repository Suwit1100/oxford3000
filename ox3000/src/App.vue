<template>
  <div class="app-container">
    <Sidebar class="d-none d-md-block" />

    <!-- Mobile Sidebar Toggle -->
    <div class="d-md-none mobile-header bg-dark text-white p-3">
      <button class="btn btn-light btn-sm" @click="showMobileSidebar = !showMobileSidebar">
        <i class="bi bi-list"></i> Menu
      </button>
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="showMobileSidebar" class="mobile-sidebar d-md-none">
      <Sidebar />
    </div>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const showMobileSidebar = ref(false);
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1050;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>