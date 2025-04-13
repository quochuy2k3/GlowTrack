import { MediaService } from '@/services/media/media.service';

export async function uploadImage(dataImg: any) {
  const fileUri = dataImg.uri;
  const fileName = dataImg.fileName || fileUri.split('/').pop();
  const mimeType = dataImg.mimeType || 'image/jpeg';
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  try {
    const response = await MediaService.uploadAvatar(formData);
    return response;
  } catch (error) {
    console.error('Error uploading image', error);
  }
}
