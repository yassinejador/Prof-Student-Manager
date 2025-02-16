import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id); // ID depuis l'URL
    const { nom } = await request.json(); // Nom depuis le body

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de la matière est requis" },
        { status: 400 }
      );
    }

    const matiere = await prisma.matieres.update({
      where: { id },
      data: { nom },
    });

    return NextResponse.json(matiere);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de la matière" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id); // ID depuis l'URL

    await prisma.matieres.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la matière" },
      { status: 500 }
    );
  }
}
