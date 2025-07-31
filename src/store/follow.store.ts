import { create } from 'zustand';

interface FollowState {
  followCount: number;
  setFollowCount: (count: number) => void;
  increaseFollow: () => void;
  decreaseFollow: () => void;
}

export const useFollowStore = create<FollowState>(set => ({
  followCount: 0,
  setFollowCount: count => set({ followCount: count }),
  increaseFollow: () => set(state => ({ followCount: state.followCount + 1 })),
  decreaseFollow: () => set(state => ({ followCount: state.followCount - 1 })),
}));
