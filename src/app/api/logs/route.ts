import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const logs = await prisma.logs.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de récupération" },
      { status: 500 }
    );
  }
}
