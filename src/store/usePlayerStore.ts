import { create } from "zustand";

interface Track {
  id: string;
  name: string;
  artist: { name: string };
  url: string;
  duration: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (queue: Track[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  setCurrentTrack: (track) => set({ 
    currentTrack: track, 
    isPlaying: !!track, 
    progress: 0 
  }),
  setQueue: (queue) => set({ queue }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  nextTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1], isPlaying: true, progress: 0 });
    }
  },
  prevTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], isPlaying: true, progress: 0 });
    }
  },
}));
