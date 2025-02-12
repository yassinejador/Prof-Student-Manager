import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateProfCard } from '@/lib/generateProfCard'

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

    const pdfBytes = await generateProfCard(professeur);

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="carte-professionnelle-${professeur.user.nom}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la carte' },
      { status: 500 }
    )
  }
}