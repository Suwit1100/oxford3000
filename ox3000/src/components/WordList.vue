<template>
    <div class="word-list card">
        <div class="card-header">
            <h5 class="mb-0">คำศัพท์วันนี้ ({{ words.length }} คำ)</h5>
        </div>
        <div class="card-body">
            <div class="list-group">
                <div v-for="word in words" :key="word"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ word }}</strong>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" @click="$emit('wordClick', word)">
                        ดูรายละเอียด
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    words: string[];
}

defineProps<Props>();
defineEmits(['wordClick']);
</script>