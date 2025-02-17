import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Déconnecté avec succès" });

    // Supprimer le cookie en mettant une date d'expiration passée
    response.cookies.set("token", "", { expires: new Date(0), path: "/" });

    return response;
}
