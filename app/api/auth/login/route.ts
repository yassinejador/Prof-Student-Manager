import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";




export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Vérifie si l'utilisateur existe
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Vérifie le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
        }

        // Génère le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Stocke le token dans les cookies
        (await
            // Stocke le token dans les cookies
            cookies()).set("token", token, {
            httpOnly: true, // Empêche l'accès au cookie via JavaScript
            secure: process.env.NODE_ENV === "production", // Utilisez "secure" en production (HTTPS)
            maxAge: 3600, // Durée de vie du cookie (1 heure)
            path: "/", // Accessible sur tout le site
        });
        console.log("Token stocké dans les cookies :", token);

        return NextResponse.json({ message: "Connexion réussie", token }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 });
    }
};

/**
 * Récupère les informations de l'utilisateur connecté.
 * @returns Les informations de l'utilisateur ou null si non authentifié.
 */
export const getAuthenticatedUser = async () => {
    try {
        // Récupère le token depuis les cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null; // Aucun token trouvé
        }

        // Vérifie et décode le token
        const decoded = verifyToken(token);
        if (!decoded) {
            return null; // Token invalide
        }

        // Récupère l'utilisateur depuis la base de données
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                nom: true,
                prenom: true,
                telephone: true, 
                photo_profil: true,
            },
        });

        if (!user) {
            return null; // Utilisateur non trouvé
        }

        return user; // Retourne les informations de l'utilisateur
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return null;
    }
};
