import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const semestre = searchParams.get('semestre');

  try {
    const etudiants = await prisma.etudiants.findMany({
      where: semestre ? { semestre_inscription: Number(semestre) } : {},
      include: { user: true, EtudiantModules: true }
    });
    return NextResponse.json(etudiants);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validation et création de l'étudiant
    return NextResponse.json({ message: "Étudiant créé" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}