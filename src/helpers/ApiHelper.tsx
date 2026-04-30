import axios from 'axios';
import { soundApi, birdApi, imageApi } from 'services/api';

import { Bird, BirdSound } from 'types/bird';

export const fetchAllBirds = async (): Promise<Bird[]> => {

  try {

    const response = await birdApi.list({ quantity: -1 });

    const birds = Array.isArray(response.data) ? response.data : [];

    return birds;

  } catch (error) {

    console.error("Failed to fetch birds:", error);

    return [];

  }

};


export const fetchBirdImage = async (bird: Bird, image_index: number = 1): Promise<string> => {

  try {

    const response = await imageApi.getBirdImage(bird.eBird, image_index);

    const imageUrl = URL.createObjectURL(response.data);

    return imageUrl;

  } catch (error) {

    // 404 = no image for this bird, expected. Only log unexpected errors.
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      console.error(`Failed to fetch image for ${bird.eBird}:`, error);
    }

    throw error;

  }

};


export const fetchAudioPathList = async (bird: Bird): Promise<BirdSound[]> => {

  try {

    const response = await soundApi.listByLabel(bird.eBird);

    let birdSoundList: BirdSound[] = [];
    if (Array.isArray(response.data)) {
      birdSoundList = response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      birdSoundList = (response.data as any).results;
    }

    return birdSoundList;

  } catch (error) {

    console.error(`Failed to fetch audio paths for ${bird.common_name}:`, error);

    return [];

  }

}; 