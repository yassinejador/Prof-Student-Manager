// app/actions/professeurs.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function deleteProfesseur(formData: FormData) {
  try {
    const id = formData.get('id');
    const res = await fetch(`${process.env.API_URL}/api/professeurs/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete professor');
    
    revalidatePath('/professeurs');
  } catch (error) {
    console.error('Error deleting professor:', error);
    throw error;
  }
}