// types/index.ts
export interface Story {
  id: number;
  content: string;
  translation: string;
  wordSetId: number;
}

export interface WordSet {
  id: number;
  words: string[];
}

export interface Word {
  word: string;
  partOfSpeech?: string;
  meaning: string;
  exampleSentence?: string;
}

export interface LearnedState {
  stories: number[];
  words: string[];
}

// Declare window.storage for Claude Artifacts
declare global {
  interface Window {
    storage: {
      get(
        key: string,
        shared?: boolean
      ): Promise<{ key: string; value: string; shared: boolean } | null>;
      set(
        key: string,
        value: string,
        shared?: boolean
      ): Promise<{ key: string; value: string; shared: boolean } | null>;
      delete(
        key: string,
        shared?: boolean
      ): Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
      list(
        prefix?: string,
        shared?: boolean
      ): Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>;
    };
  }
}

export {};
