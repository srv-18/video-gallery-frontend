import { create } from 'zustand';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  userId: string;
}

interface VideoState {
  videos: Video[];
  userVideos: Video[];
  isLoading: boolean;
  setVideos: (videos: Video[]) => void;
  setUserVideos: (videos: Video[]) => void;
  setLoading: (loading: boolean) => void;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  userVideos: [],
  isLoading: false,
  setVideos: (videos) => set({ videos }),
  setUserVideos: (userVideos) => set({ userVideos }),
  setLoading: (isLoading) => set({ isLoading }),
  addVideo: (video) => set((state) => ({ 
    userVideos: [...state.userVideos, video],
    videos: [...state.videos, video]
  })),
  updateVideo: (id, updates) => set((state) => ({
    userVideos: state.userVideos.map(v => v.id === id ? { ...v, ...updates } : v),
    videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  deleteVideo: (id) => set((state) => ({
    userVideos: state.userVideos.filter(v => v.id !== id),
    videos: state.videos.filter(v => v.id !== id)
  })),
}));