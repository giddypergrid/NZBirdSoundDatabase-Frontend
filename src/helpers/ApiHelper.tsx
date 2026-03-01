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

    const response = await imageApi.getBirdImage(bird.common_name, image_index);

    const imageUrl = URL.createObjectURL(response.data);

    return imageUrl;

  } catch (error) {

    console.error(`Failed to fetch image for ${bird.common_name}:`, error);

    return 'https://via.placeholder.com/400x200?text=No+Image';

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