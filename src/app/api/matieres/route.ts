import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const semestre = searchParams.get('semestre');

  try {
    const modules = await prisma.modules.findMany({
      where: semestre ? { semestre: Number(semestre) } : {}
    });
    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}