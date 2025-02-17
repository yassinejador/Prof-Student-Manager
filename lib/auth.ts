import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";


const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";



// 🔐 Fonction pour hasher un mot de passe
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}


// 🔑 Fonction pour vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// 🏷 Fonction pour générer un token JWT
export function generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
        { id: userId, email, role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
}

// 🛡 Fonction pour vérifier un token JWT
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

/**
 * Vérifie si l'utilisateur est authentifié en validant son token JWT.
 * @param token Le token JWT de l'utilisateur.
 * @returns Les informations de l'utilisateur décodées ou null si le token est invalide.
 */
export const authenticateUser = async (token: string) => {
    try {
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
        console.error("Erreur lors de l'authentification :", error);
        return null;
    }
};
  

