import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom } = body;

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de la matière est requis" },
        { status: 400 }
      );
    }

    const matiere = await prisma.matieres.create({
      data: {
        nom,
      },
    });

    return NextResponse.json(matiere);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la matière" },
      { status: 500 }
    );
  }
}