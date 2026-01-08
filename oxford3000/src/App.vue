<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar :current-page="currentPage" :learned-stories-count="learnedStoriesCount"
      :learned-words-count="learnedWordsCount" :total-stories="totalStories" :total-words="totalWords"
      @navigate="handleNavigate" @reset="handleReset" />

    <!-- Main Content -->
    <div class="flex-grow-1" style="overflow-y: auto; height: 100vh;">
      <LessonPage v-if="currentPage === 'lesson'" />
      <VocabularyPage v-else-if="currentPage === 'vocabulary'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import LessonPage from './components/LessonPage.vue';
import VocabularyPage from './components/VocabularyPage.vue';
import { useStorage } from './composables/useStorage';
import { stories } from './data/stories';
import { vocabulary } from './data/vocabulary';

const currentPage = ref('lesson');

const {
  learnedStoriesCount,
  learnedWordsCount,
  loadState,
  resetAll
} = useStorage();

onMounted(async () => {
  await loadState();
});

const totalStories = computed(() => stories.length);
const totalWords = computed(() => Object.keys(vocabulary).length);

const handleNavigate = (page: string) => {
  currentPage.value = page;
};

const handleReset = async () => {
  if (confirm('คุณต้องการรีเซ็ตความคืบหน้าทั้งหมดใช่หรือไม่?')) {
    await resetAll();
    alert('รีเซ็ตเรียบร้อยแล้ว');
  }
};
</script>