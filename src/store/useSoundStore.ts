import { create } from 'zustand';
import { Sound, SoundCategory } from '../types/sound';
import { AudioEngine } from '../audio/AudioEngine';

interface MixerLayer {
  soundId: string;
  volume: number;
}

interface SoundState {
  allSounds: Sound[];
  categories: SoundCategory[];
  activeCategory: SoundCategory;
  visibleSounds: Sound[];
  pageSize: number;
  mixerLayers: MixerLayer[];
  isLoading: boolean;
  error: string | null;

  setAllSounds: (sounds: Sound[]) => void;
  setActiveCategory: (category: SoundCategory) => void;
  loadMoreSounds: () => void;
  toggleSound: (sound: Sound) => Promise<void>;
  updateVolume: (soundId: string, volume: number) => Promise<void>;
  clearMix: () => Promise<void>;
  loadSharedMix: (layers: MixerLayer[]) => Promise<void>;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  allSounds: [],
  categories: ['All', 'Rain', 'Nature', 'White Noise', 'Ambient'],
  activeCategory: 'All',
  visibleSounds: [],
  pageSize: 5,
  mixerLayers: [],
  isLoading: false,
  error: null,

  setAllSounds: (sounds) => {
    set({ allSounds: sounds });
    get().setActiveCategory(get().activeCategory);
  },

  setActiveCategory: (category) => {
    const { allSounds, pageSize } = get();
    const filtered = category === 'All'
      ? allSounds
      : allSounds.filter(s => s.category === category);

    set({
      activeCategory: category,
      visibleSounds: filtered.slice(0, pageSize)
    });
  },

  loadMoreSounds: () => {
    const { allSounds, activeCategory, visibleSounds, pageSize } = get();
    const filtered = activeCategory === 'All'
      ? allSounds
      : allSounds.filter(s => s.category === activeCategory);

    const nextBatch = filtered.slice(0, visibleSounds.length + pageSize);
    set({ visibleSounds: nextBatch });
  },

  toggleSound: async (sound) => {
    const { mixerLayers } = get();
    const existing = mixerLayers.find(l => l.soundId === sound.id);

    if (existing) {
      await AudioEngine.stopSound(sound.id);
      set({ mixerLayers: mixerLayers.filter(l => l.soundId !== sound.id) });
    } else {
      if (mixerLayers.length >= 6) return; // Limit to 6 sounds as per doc
      try {
        await AudioEngine.playSound(sound, 0.5);
        set({ mixerLayers: [...mixerLayers, { soundId: sound.id, volume: 0.5 }] });
      } catch (err) {
        set({ error: 'Failed to play sound. Please check your connection.' });
        setTimeout(() => set({ error: null }), 3000);
      }
    }
  },

  updateVolume: async (soundId, volume) => {
    await AudioEngine.setVolume(soundId, volume);
    set({
      mixerLayers: get().mixerLayers.map(l =>
        l.soundId === soundId ? { ...l, volume } : l
      )
    });
  },

  clearMix: async () => {
    await AudioEngine.stopAll();
    set({ mixerLayers: [] });
  },

  loadSharedMix: async (layers) => {
    const { allSounds } = get();
    await AudioEngine.stopAll();
    const newLayers: MixerLayer[] = [];

    for (const layer of layers) {
      const sound = allSounds.find(s => s.id === layer.soundId);
      if (sound) {
        try {
          await AudioEngine.playSound(sound, layer.volume);
          newLayers.push(layer);
        } catch (e) {
          console.error('Failed to load shared sound:', layer.soundId);
        }
      }
    }
    set({ mixerLayers: newLayers });
  }
}));
