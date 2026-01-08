<template>
    <div class="word-list-section">
        <h6 class="text-uppercase fw-bold mb-3 small tracking-wider px-1">
            คำศัพท์ที่ต้องเรียน ({{ words.length }})
        </h6>

        <div class="row g-2">
            <div v-for="word in words" :key="word" class="col-6 col-md-4 col-lg-3">
                <div class="word-pill" @click="$emit('wordClick', word)">
                    <span class="fw-medium">{{ word }}</span>
                    <i class="bi bi-chevron-right small opacity-50"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props { words: string[]; }
defineProps<Props>();
defineEmits(['wordClick']);
</script>

<style scoped>
.word-pill {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-main);
}

.word-pill:hover {
    background-color: rgba(59, 130, 246, 0.1);
    /* Primary tint */
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
}

.word-pill:active {
    transform: scale(0.98);
}
</style>