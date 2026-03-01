// services/profileService.ts
export interface ProfileData {
  email: string;
  bio?: string;
  birthdate?: string;
  image?: string; 
}

const API_URL = 'http://192.168.1.16:8000/api';

export const profileService = {
  async getProfile(userUuid: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_URL}/profile/${userUuid}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(userUuid: string, data: { bio?: string; birthdate?: string }): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/profile/${userUuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadImage(userUuid: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      console.log('file', file)

      const response = await fetch(`${API_URL}/profile/${userUuid}/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.image;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};