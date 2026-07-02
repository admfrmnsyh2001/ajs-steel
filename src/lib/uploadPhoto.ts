import { supabase } from './supabase';

export async function uploadPhoto(file: File, folder: string): Promise<string> {
  // Buat nama file yang unik untuk menghindari konflik/overwrite
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('photos')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading photo:', error.message);
    throw new Error(error.message);
  }

  // Dapatkan Public URL setelah berhasil upload
  const { data: publicUrlData } = supabase.storage
    .from('photos')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
