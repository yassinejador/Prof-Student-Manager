// app/professeurs/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface ProfesseurDetailProps {
    professeur: {
        user: {
            nom: string;
            prenom: string;
            email: string;
            telephone: string;
            photo_profil?: string | null;
        };
        statut: "permanent" | "vacataire";
        MatieresDetails: Array<{
            matiere: {
                nom: string;
            };
        }>;
    };
}

export default async function ProfesseurPage({
    params,
}: {
    params: { id: string };
}) {
    const professeur = await prisma.professeurs.findUnique({
        where: { id: parseInt(params.id) }, // Assurez-vous que params.id est un nombre
        include: {
            user: true,
            MatieresDetails: {
                include: {
                    matiere: true,
                },
            },
        },
    });

    if (!professeur) {
        notFound(); // Si aucun professeur n'est trouvé, retournez 404
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* Titre du professeur */}
            <h1 className="text-4xl font-bold text-center mb-4">
                {professeur.user.nom} {professeur.user.prenom}
            </h1>

            <div className="text-center mb-6 text-xl text-gray-700">
                <span className="font-semibold">Statut: </span>
                {professeur.statut}
            </div>

            {/* Tableau des informations principales */}
            <table className="min-w-full table-auto border-collapse mb-6">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Détails</th>
                        <th className="px-4 py-2 border-b text-left">Informations</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-2 border-b font-semibold">Email</td>
                        <td className="px-4 py-2 border-b">{professeur.user.email}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b font-semibold">Téléphone</td>
                        <td className="px-4 py-2 border-b">{professeur.user.telephone}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border-b font-semibold">Statut</td>
                        <td className="px-4 py-2 border-b">{professeur.statut}</td>
                    </tr>
                </tbody>
            </table>

            {/* Tableau des matières enseignées */}
            
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Matière enseignées </th>
                    </tr>
                </thead>
                <tbody>
                    {professeur.MatieresDetails.length > 0 ? (
                        professeur.MatieresDetails.map((detail, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border-b">{detail.matiere.nom}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-4 py-2 border-b text-gray-500">Aucune matière attribuée</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}