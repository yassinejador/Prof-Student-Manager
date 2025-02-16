import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    // Compter le total des professeurs
    const totalProfesseurs = await prisma.professeurs.count();

    // Compter le total des matières
    const totalMatieres = await prisma.matieres.count();

    const totalProfesseursActifs = await prisma.professeurs.count({
        where: {
          statut: {
            in: ['permanent', 'vacataire'],
          },
        },
      });

    // Compter les professeurs permanents
    const totalProfesseursPermanents = await prisma.professeurs.count({
      where: { statut: 'permanent' },
    });

    // Compter les professeurs vacataires
    const totalProfesseursVacataires = await prisma.professeurs.count({
      where: { statut: 'vacataire' },
    });

    return NextResponse.json({
      totalProfesseurs,
      totalMatieres,
      totalProfesseursPermanents,
      totalProfesseursVacataires,
      totalProfesseursActifs,
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
