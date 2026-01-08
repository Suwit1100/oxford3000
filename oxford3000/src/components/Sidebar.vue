<template>
    <div class="bg-dark text-white p-3" style="height: 100vh; width: 250px;">
        <h4 class="mb-4">Oxford 3000</h4>

        <div class="mb-4">
            <div class="small text-muted mb-2">ความคืบหน้า</div>
            <div class="mb-2">
                <strong>{{ learnedStoriesCount }}</strong> / {{ totalStories }} Stories
            </div>
            <div>
                <strong>{{ learnedWordsCount }}</strong> / {{ totalWords }} Words
            </div>
        </div>

        <hr class="border-secondary" />

        <nav class="nav flex-column">
            <a href="#" class="nav-link text-white" :class="{ 'active bg-primary': currentPage === 'lesson' }"
                @click.prevent="$emit('navigate', 'lesson')">
                📖 Lesson
            </a>
            <a href="#" class="nav-link text-white" :class="{ 'active bg-primary': currentPage === 'vocabulary' }"
                @click.prevent="$emit('navigate', 'vocabulary')">
                📚 Vocabulary
            </a>
        </nav>

        <div class="mt-auto pt-4">
            <button class="btn btn-sm btn-outline-light w-100" @click="$emit('reset')">
                รีเซ็ตทั้งหมด
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    currentPage: string;
    learnedStoriesCount: number;
    learnedWordsCount: number;
    totalStories: number;
    totalWords: number;
}>();

defineEmits<{
    navigate: [page: string];
    reset: [];
}>();
</script>

<style scoped>
.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.nav-link.active {
    border-radius: 4px;
}
</style>