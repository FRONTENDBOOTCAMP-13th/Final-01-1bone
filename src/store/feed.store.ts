import { create } from 'zustand';

interface FeedStore {
  content: string;
  imageFileList: File[];
  tag: string[];

  setContent: (content: string) => void;
  setImageFileList: (imageFileList: File[]) => void;
  setTag: (tag: string[]) => void;

  resetFeed: () => void;
}

const useFeedStore = create<FeedStore>(set => ({
  content: '',
  imageFileList: [],
  tag: [],

  setContent: content => set(state => ({ ...state, content })),
  setImageFileList: imageFileList =>
    set(state => ({ ...state, imageFileList })),
  setTag: tag => set(state => ({ ...state, tag })),

  resetFeed: () =>
    set(state => ({ ...state, content: '', imageFileList: [], teg: [] })),
}));

export default useFeedStore;
