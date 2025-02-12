import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const semestre = searchParams.get('semestre');

  try {
    const matieres = await prisma.matieres.findMany();
    return NextResponse.json(matieres);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de matieres" },
      { status: 500 }
    );
  }
}