export interface Story {
  id: number;
  content: string;
  translation: string;
  wordSetId: number;
  isLearned?: boolean;
}

export interface WordSet {
  id: number;
  storyId: number;
  words: string[]; // 10 คำต่อ set
}

export interface Word {
  word: string;
  partOfSpeech?: string;
  meaning?: string;
  exampleSentence?: string;
  isLearned?: boolean;
}

export interface DictionaryResponse {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

export interface ProgressState {
  learnedStories: Set<number>;
  learnedWords: Set<string>;
}
