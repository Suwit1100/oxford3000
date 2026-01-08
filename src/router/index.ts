import { createRouter, createWebHistory } from "vue-router";
import LessonView from "@/views/LessonView.vue";
import VocabularyView from "@/views/VocabularyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/lesson",
    },
    {
      path: "/lesson",
      name: "lesson",
      component: LessonView,
    },
    {
      path: "/vocabulary",
      name: "vocabulary",
      component: VocabularyView,
    },
  ],
});

export default router;
