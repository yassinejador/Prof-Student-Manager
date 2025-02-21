import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Récupérer l'utilisateur en premier
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      include: {
        Professeur: {
          include: {
            MatieresDetails: {
              include: { matiere: true }, // Inclure les matières associées
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur est un professeur
    if (!user.Professeur) {
      return NextResponse.json(
        { error: 'Cet utilisateur n\'est pas un professeur' },
        { status: 404 }
      );
    }

    const professeur = user.Professeur;

    // Extraire les données nécessaires
    return NextResponse.json({
      nom: user.nom,
      prenom: user.prenom,
      matieres: professeur.MatieresDetails.map((md) => md.matiere.nom),
      statut: professeur.statut,
      email: user.email,
      telephone: user.telephone,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails' },
      { status: 500 }
    );
  }
}