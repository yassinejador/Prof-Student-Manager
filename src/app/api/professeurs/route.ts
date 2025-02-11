import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function POST(request: Request) {
  const formData = await request.formData();
  
  try {
    // Traitement du formulaire et création du professeur
    // (Gestion de l'upload de fichier et validation des données)
    return NextResponse.json({ message: "Professeur créé" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du professeur" },
      { status: 500 }
    );
  }
}