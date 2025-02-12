import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function GET() {
  try {
    const professeurs = await prisma.professeurs.findMany({
      include: { user: true, Matieres: true }
    });
    return NextResponse.json(professeurs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professeurs" },
      { status: 500 }
    );
  }
}

// POST 

const professeurSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),
  statut: z.enum(['permanent', 'vacataire']),
  matieres: z.array(z.string()),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    // Validation des données
    const data = Object.fromEntries(formData.entries());
    const parsedData = professeurSchema.parse({
      ...data,
      matieres: JSON.parse(data.matieres as string)
    });

    // Upload de la photo
    const photo = formData.get('photo_profil') as File;
    const buffer = Buffer.from(await photo.arrayBuffer());
    const filename = `prof-${Date.now()}${path.extname(photo.name)}`;
    await writeFile(path.join(process.cwd(), 'public/images/users/' + filename), buffer);

    // Transaction Prisma
    const result = await prisma.$transaction(async (tx) => {
      // Création de l'utilisateur
      const user = await tx.users.create({
        data: {
          email: parsedData.email,
          password: parsedData.password, // À hasher en réel
          role: 'professeur',
          nom: parsedData.nom,
          prenom: parsedData.prenom,
          telephone: parsedData.telephone,
          photo_profil: `${filename}`
        }
      });

      // Création du professeur
      const professeur = await tx.professeurs.create({
        data: {
          user_id: user.id,
          statut: parsedData.statut,
        }
      });

      // Liaison des matières
      await tx.matieres.createMany({
        data: parsedData.matieres.map(matiere => ({
          professeur_id: professeur.id,
          nom: matiere
        })),
        skipDuplicates: true
      });

      return professeur;
    });

    // Log de l'action
    await prisma.logs.create({
      data: {
        user_id: result.user_id,
        action_type: 'CREATE_PROFESSEUR',
        details: JSON.stringify(result)
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création", details: error },
      { status: 500 }
    );
  }
}