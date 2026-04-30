import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { birdApi, soundApi, imageApi } from 'services/api';
import { Bird, BirdSound, BirdSoundFilterParams } from 'types/bird';

// ==================== Bird Queries ====================

export const useBirdList = (quantity: number = -1) => {
  return useQuery({
    queryKey: ['birds', 'list', quantity],
    queryFn: async () => {
      const response = await birdApi.list({ quantity });
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBird = (eBird: string) => {
  return useQuery({
    queryKey: ['birds', eBird],
    queryFn: async () => {
      const response = await birdApi.getByEBird(eBird);
      return response.data;
    },
    enabled: !!eBird,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== Audio Queries ====================

export const useBirdSoundList = (bird: Bird, filters?: BirdSoundFilterParams) => {
  return useQuery({
    queryKey: ['sounds', bird.eBird, filters],
    queryFn: async () => {
      const response = await soundApi.listByLabel(bird.eBird, filters);
      // Backend uses DRF pagination → {count, next, previous, results: [...]}.
      // Tolerate both paginated and bare-array shapes for robustness.
      const data = response.data as unknown;
      if (Array.isArray(data)) return data as BirdSound[];
      if (data && Array.isArray((data as { results?: unknown }).results)) {
        return (data as { results: BirdSound[] }).results;
      }
      return [];
    },
    enabled: !!bird.eBird,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAudioUrl = (birdSound: BirdSound) => {
  return useQuery({
    queryKey: ['audio', birdSound.filename],
    queryFn: async () => {
      const response = await soundApi.getBirdAudio(birdSound.eBird, birdSound.filename);
      return URL.createObjectURL(response.data);
    },
    enabled: !!birdSound.filename,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
};

// Batch fetch multiple audio URLs
// export const useAudioUrls = (filenames: string[]) => {
//   return useQueries({
//     queries: filenames.map((filename) => ({
//       queryKey: ['audio', filename],
//       queryFn: async () => {
//         const response = await soundApi.getBirdAudio(filename);
//         return URL.createObjectURL(response.data);
//       },
//       enabled: !!filename,
//       staleTime: Infinity,
//       gcTime: 10 * 60 * 1000,
//     })),
//   });
// };

// ==================== Image Queries ====================

export const useBirdImage = (bird: Bird, index: number = 0) => {
  return useQuery({
    queryKey: ['image', bird.eBird, index],
    queryFn: async () => {
      const response = await imageApi.getBirdImage(bird.eBird, index);
      return URL.createObjectURL(response.data);
    },
    enabled: !!bird.eBird,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    // 404 = no image for this bird, don't retry. Retry up to 2x on network/5xx.
    retry: (failureCount, error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};
