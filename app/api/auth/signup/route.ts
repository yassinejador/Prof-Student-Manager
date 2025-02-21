import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; 


export async function POST(req: Request) {
    try {
        const { nom, prenom, email, password, telephone, role, statut } = await req.json();

        // Vérifie si l'email existe déjà
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await prisma.users.create({
            data: {
                nom,
                prenom,
                email,
                password: hashedPassword,
                telephone,
                role
            },
        });

        // Si l'utilisateur est un professeur, l'ajouter à la table Professeurs
        if (role === "professeur") {
            await prisma.professeurs.create({
                data: {
                    user_id: user.id, // Associe l'utilisateur au professeur
                    statut, // Assurez-vous que `statut` est bien envoyé dans la requête
                },
            });
        }

        return NextResponse.json({ message: "Utilisateur créé avec succès", user }, { status: 201 });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
