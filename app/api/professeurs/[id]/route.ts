import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import path from 'path';
import { writeFile } from 'fs/promises';
import bcrypt from 'bcrypt';

// Ajoutez ce schéma de validation pour les mises à jour
const professeurUpdateSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telephone: z.string().min(10).optional(),
  statut: z.enum(['permanent', 'vacataire']).optional(),
  password: z.string().min(8).optional()
}).partial();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log(id);
  return handleUpdate(request, id);
}

async function handleUpdate(
  request: Request,
  professeurId: string
) {
  const ACTION_TYPE = 'UPDATE_PROFESSEUR';
  const formData = await request.formData();
  try {
    if (!professeurId) {
      return NextResponse.json({ error: "Professeur ID requis" }, { status: 400 });
    }

    const existingProfesseur = await prisma.professeurs.findUnique({
      where: { id: Number(professeurId) },
      include: { user: true }
    });

    if (!existingProfesseur) {
      return NextResponse.json({ error: "Professeur introuvable" }, { status: 404 });
    }

    const userId = existingProfesseur.user_id;
    const rawData = Object.fromEntries(formData.entries());

    // Gestion de la photo séparément
    const photo = formData.get('photo_profil') as File | null;
    delete rawData.photo_profil;
    delete rawData.professeur_id;

    // Validation différente selon le type de mise à jour
    const parsedData = professeurUpdateSchema.parse(rawData);

    // Séparer les données de l'utilisateur et du professeur
    const { statut, ...userData } = parsedData;

    // Traitement de la photo
    let filename = existingProfesseur.user.photo_profil;
    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      filename = `prof-${Date.now()}${path.extname(photo.name)}`;
      await writeFile(path.join(process.cwd(), 'public/images/users/', filename), photoBuffer);
    }

    // Hash du mot de passe si fourni
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : undefined;

    const result = await prisma.$transaction(async (tx) => {
      // Mise à jour de l'utilisateur
      const updatedUser = await tx.users.update({
        where: { id: userId },
        data: {
          ...userData,
          photo_profil: filename,
          ...(hashedPassword && { password: hashedPassword })
        }
      });

      // Mise à jour du professeur
      const updatedProfesseur = await tx.professeurs.update({
        where: { id: Number(professeurId) },
        data: {
          statut: statut
        }
      });

      // Journalisation
      await tx.logs.create({
        data: {
          user_id: userId,
          action_type: ACTION_TYPE,
          details: JSON.stringify({
            ...userData,
            statut: statut,
            photo_profil: filename,
          })
        }
      });

      return {
        user: updatedUser,
        professeur: updatedProfesseur,
      };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Erreur de validation", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid professeur ID' },
        { status: 400 }
      )
    }

    const professeurId = parseInt(id)

    const professeur = await prisma.professeurs.findUnique({
      where: { id: professeurId },
      select: { user_id: true }
    })

    if (!professeur) {
      return NextResponse.json(
        { error: 'Professeur not found' },
        { status: 404 }
      )
    }
    const userId = professeur.user_id

    // Perform transaction for cascading delete
    const result = await prisma.$transaction(async (prisma) => {

      // 2. Delete related MatieresDetails
      await prisma.matieresDetails.deleteMany({
        where: { professeur_id: professeurId }
      })

      // 3. Delete the professeur
      await prisma.professeurs.delete({
        where: { id: professeurId }
      })

      // 4. Delete user's logs
      await prisma.logs.deleteMany({
        where: { user_id: userId }
      })

      // 5. Delete the user
      await prisma.users.delete({
        where: { id: userId }
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting professeur:', error)

    // Handle not found error
    if (error instanceof Error && error.message === 'Professeur not found') {
      return NextResponse.json(
        { error: 'Professeur not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}