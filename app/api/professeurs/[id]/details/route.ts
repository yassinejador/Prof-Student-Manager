import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const professeur = await prisma.professeurs.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: true,
        MatieresDetails: {
          include: { matiere: true },
        },
      },
    })

    if (!professeur) {
      return NextResponse.json({ error: 'Professeur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      nom: professeur.user.nom,
      prenom: professeur.user.prenom,
      matieres: professeur.MatieresDetails.map((md) => md.matiere.nom),
      statut: professeur.statut,
      email: professeur.user.email,
      telephone: professeur.user.telephone,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails' },
      { status: 500 }
    )
  }
}