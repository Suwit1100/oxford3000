import { Story, WordSet } from "@/types";

export const stories: Story[] = [
  {
    id: 1,
    content: `Sarah walks to school every morning. She likes the fresh air and the time to think. Today the weather is beautiful and warm. Birds sing in the trees along the street. She meets her friend Tom at the corner. They talk about their homework and laugh together. School starts at eight o'clock sharp.`,
    translation: `ซาร่าห์เดินไปโรงเรียนทุกเช้า เธอชอบอากาศบริสุทธิ์และเวลาที่ใช้ในการคิด วันนี้อากาศสวยงามและอบอุ่น นกร้องเพลงอยู่บนต้นไม้ตามถนน เธอพบเพื่อนของเธอชื่อทอมที่มุมถนน พวกเขาคุยกันเกี่ยวกับการบ้านและหัวเราะด้วยกัน โรงเรียนเริ่มตรงเวลาแปดโมงเช้า`,
    wordSetId: 1,
    isLearned: false,
  },
  {
    id: 2,
    content: `The small cat sits under the table. It watches a mouse near the door. The mouse is very quick and clever. It runs behind the old chair in the corner. The cat jumps but misses the mouse completely. After a while, the cat feels tired and sleeps. The mouse comes out again and eats some bread.`,
    translation: `แมวตัวเล็กนั่งอยู่ใต้โต๊ะ มันจับตาดูหนูตัวหนึ่งใกล้ประตู หนูตัวนั้นรวดเร็วและฉลาดมาก มันวิ่งไปหลังเก้าอี้เก่าที่มุมห้อง แมวกระโดดแต่พลาดหนูไปอย่างสิ้นเชิง หลังจากนั้นไม่นาน แมวรู้สึกเหนื่อยและหลับไป หนูออกมาอีกครั้งและกินขนมปังบางชิ้น`,
    wordSetId: 2,
    isLearned: false,
  },
];

export const wordSets: WordSet[] = [
  {
    id: 1,
    storyId: 1,
    words: [
      "walk",
      "school",
      "morning",
      "like",
      "fresh",
      "air",
      "time",
      "think",
      "weather",
      "beautiful",
    ],
  },
  {
    id: 2,
    storyId: 2,
    words: [
      "small",
      "cat",
      "sit",
      "table",
      "watch",
      "mouse",
      "door",
      "quick",
      "clever",
      "run",
    ],
  },
];

// Helper function
export function getWordSetByStoryId(storyId: number): WordSet | undefined {
  return wordSets.find((ws) => ws.storyId === storyId);
}

export function getStoryById(id: number): Story | undefined {
  return stories.find((s) => s.id === id);
}
