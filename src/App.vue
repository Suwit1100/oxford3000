<template>
  <div class="app-container">
    <div v-if="showMobileSidebar" class="sidebar-backdrop d-md-none" @click="showMobileSidebar = false"></div>

    <transition name="slide">
      <div v-if="showMobileSidebar || isDesktop" class="sidebar-wrapper"
        :class="{ 'mobile-active': showMobileSidebar }">
        <Sidebar @close-sidebar="showMobileSidebar = false" />
      </div>
    </transition>

    <main class="main-content">
      <header class="mobile-header d-md-none d-flex align-items-center justify-content-between px-3 py-2">
        <h5 class="m-0 fw-bold text-gradient">Oxford 3000</h5>
        <button class="btn btn-icon" @click="showMobileSidebar = true">
          <i class="bi bi-list fs-4 text-white"></i>
        </button>
      </header>

      <div class="content-padding">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const showMobileSidebar = ref(false);
const isDesktop = ref(window.innerWidth >= 768);

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) showMobileSidebar.value = false;
};

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

:root {
  --bg-app: #121212;
  --bg-card: #1E1E1E;
  --bg-card-hover: #2C2C2C;
  --text-main: #E0E0E0;
  --text-muted: #A0A0A0;
  --primary: #3B82F6;
  --primary-glow: rgba(59, 130, 246, 0.3);
  --sidebar-width: 280px;
}

body {
  background-color: var(--bg-app);
  color: var(--text-main);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Global Card Styles */
.card {
  background-color: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  color: var(--text-main);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 1.25rem;
}

/* Layout */
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar-wrapper {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1050;
  background-color: var(--bg-card);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.content-padding {
  padding: 2rem;
}

/* Mobile Styles */
.mobile-header {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: 1040;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .sidebar-wrapper {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar-wrapper.mobile-active {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
  }

  .content-padding {
    padding: 1rem;
  }
}

/* Utilities */
.text-gradient {
  background: linear-gradient(45deg, #3B82F6, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 0.5rem;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>