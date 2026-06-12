import * as FileSystem from 'expo-file-system';
import { SECURITY_CONFIG } from '../config/security';

// Using a fallback if documentDirectory is not directly available in this version's types
const DOCUMENT_DIR = (FileSystem as any).documentDirectory || '';
const CACHE_DIR = `${DOCUMENT_DIR}sounds/`;

export class CloudSoundManager {
  static async ensureCacheDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  }

  static getLocalUri(soundId: string): string {
    return `${CACHE_DIR}${soundId}.mp3`;
  }

  static async isCached(soundId: string): Promise<boolean> {
    const localUri = this.getLocalUri(soundId);
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    return fileInfo.exists;
  }

  static async getSoundUri(soundId: string, remoteUrl: string): Promise<string> {
    await this.ensureCacheDirectory();
    const localUri = this.getLocalUri(soundId);

    if (await this.isCached(soundId)) {
      return localUri;
    }

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        remoteUrl,
        localUri,
        {
          headers: {
            'X-DriftSound-Token': SECURITY_CONFIG.HANDSHAKE_TOKEN,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        return result.uri;
      }
      throw new Error('Download failed');
    } catch (error) {
      console.error('Error downloading sound:', error);
      throw error;
    }
  }
}
