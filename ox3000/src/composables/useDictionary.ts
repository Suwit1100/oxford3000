import { ref } from "vue";

export interface MeaningDetail {
  partOfSpeech: string;
  definitionEn: string;
  definitionTh: string;
  example?: string;
}

export interface WordDetail {
  word: string;
  phonetic?: string;
  // audioUrl?: string; // ตัดออก
  thaiTranslation: string;
  meanings: MeaningDetail[];
}

export function useDictionary() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchEnglishDefinition = async (word: string): Promise<any> => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    if (!response.ok) throw new Error("Word not found");
    return await response.json();
  };

  const translateToThai = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=th&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await response.json();
      return data[0][0][0] || text;
    } catch (err) {
      console.error("Translation failed:", err);
      return text;
    }
  };

  // ดึงความหมายแรกของแต่ละ partOfSpeech
  const extractFirstMeanings = async (
    results: any[]
  ): Promise<MeaningDetail[]> => {
    const meanings: MeaningDetail[] = [];
    const seenPartOfSpeech = new Set<string>();

    for (const result of results) {
      for (const meaning of result.meanings) {
        const partOfSpeech = meaning.partOfSpeech;

        if (seenPartOfSpeech.has(partOfSpeech)) continue;

        const firstDef = meaning.definitions[0];
        if (!firstDef) continue;

        const definitionEn = firstDef.definition;
        const example = firstDef.example;

        const definitionTh = await translateToThai(definitionEn);

        meanings.push({
          partOfSpeech,
          definitionEn,
          definitionTh,
          example,
        });

        seenPartOfSpeech.add(partOfSpeech);
      }
    }

    return meanings;
  };

  const fetchWordDefinition = async (
    word: string
  ): Promise<WordDetail | null> => {
    loading.value = true;
    error.value = null;

    try {
      // 1. ดึงข้อมูลจาก Dictionary API
      const results = await fetchEnglishDefinition(word);

      // 2. ดึง phonetic (ตัด audioUrl ออก)
      const firstResult = results[0];
      const phonetic =
        firstResult.phonetic || firstResult.phonetics[0]?.text || "";

      // 3. แปลคำศัพท์เป็นไทย
      const thaiTranslation = await translateToThai(word);

      // 4. ดึงความหมาย
      const meanings = await extractFirstMeanings(results);

      return {
        word,
        phonetic,
        thaiTranslation,
        meanings,
      };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch definition";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    fetchWordDefinition,
  };
}
