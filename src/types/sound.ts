export type SoundCategory = 'Rain' | 'Nature' | 'White Noise' | 'Ambient' | 'Focus' | string;

export interface Sound {
  id: string;
  title: string;
  category: SoundCategory;
  url?: string;
  localAsset?: any;
  isPremium?: boolean;
}

export interface SoundCategoryManifest {
  id: string;
  name: string;
  icon?: string;
}
