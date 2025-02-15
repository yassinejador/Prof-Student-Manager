// app/actions/professeurs.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createProfesseur(formData: FormData) {
  const rawData = new FormData();
  if (formData.get("excel_file") as File) {
    rawData.append("excel_file", formData.get("excel_file") as File);
  }
  else {
    rawData.append("email", formData.get("email") as string);
    rawData.append("password", formData.get("password") as string);
    rawData.append("nom", formData.get("nom") as string);
    rawData.append("prenom", formData.get("prenom") as string);
    rawData.append("telephone", formData.get("telephone") as string);
    rawData.append("statut", formData.get("statut") as string);
    rawData.append("photo_profil", formData.get("photo_profil") as File);
    rawData.append("matieresdetails", "[\"1\",\"2\"]"); // TODO: should be dynamic
  }

  // Ajout des matières correctement
  // (formData.getAll("matieresdetails") as string[]).forEach((matiere) => {
  //   rawData.append("matieresdetails", matiere);
  // });

  console.log("Data being sent:", rawData);

  const response = await fetch(`${process.env.API_URL}/api/professeurs`, {
    method: "POST",
    body: rawData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }

  return await response.json();
}


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