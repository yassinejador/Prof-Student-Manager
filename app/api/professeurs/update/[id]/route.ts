import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Schéma de validation pour les mises à jour
const userUpdateSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telephone: z.string().min(10).optional(),
  password: z.string().min(8).optional(),
}).partial();

const professeurUpdateSchema = z.object({
  statut: z.enum(['permanent', 'vacataire']).optional(),
}).partial();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Récupérer l'utilisateur connecté
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      include: { Professeur: true }, // Inclure les données du professeur si elles existent
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());

    // Valider les données en fonction du rôle de l'utilisateur
    let userData, professeurData;
    if (user.role === 'professeur') {
      userData = userUpdateSchema.parse(rawData);
      professeurData = professeurUpdateSchema.parse(rawData);
    } else if (user.role === 'admin') {
      userData = userUpdateSchema.parse(rawData);
    } else {
      return NextResponse.json({ error: 'Action non autorisée pour ce rôle' }, { status: 403 });
    }

    // Hash du mot de passe si fourni
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Mettre à jour les données dans la table `users`
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: userData,
    });

    // Si l'utilisateur est un professeur et que le statut est modifié, mettre à jour la table `professeurs`
    if (user.role === 'professeur' && professeurData?.statut) {
      await prisma.professeurs.update({
        where: { user_id: parseInt(id) },
        data: { statut: professeurData.statut },
      });
    }

    // Retourner la réponse
    return NextResponse.json({
      message: 'Mise à jour réussie',
      user: updatedUser,
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);

    // Gestion des erreurs de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Erreur de validation', details: error.errors },
        { status: 400 }
      );
    }

    // Gestion des autres erreurs
    return NextResponse.json(
      { error: 'Erreur serveur', message: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}