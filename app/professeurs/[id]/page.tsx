// app/professeurs/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
        where: { id: parseInt(params.id) },
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
        notFound();
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Détails du Professeur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="font-medium">Nom:</p>
                            <p>{professeur.user.nom}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Prénom:</p>
                            <p>{professeur.user.prenom}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Email:</p>
                            <p>{professeur.user.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Téléphone:</p>
                            <p>{professeur.user.telephone}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Statut:</p>
                            <Badge
                                variant={
                                    professeur.statut === "permanent"
                                        ? "default"
                                        : "secondary"
                                }
                                className="capitalize"
                            >
                                {professeur.statut}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">
                            Matières enseignées
                        </h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom de la matière</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {professeur.MatieresDetails.map(
                                    (detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {detail.matiere.nom}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                                {professeur.MatieresDetails.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center text-muted-foreground"
                                        >
                                            Aucune matière attribuée
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Button asChild>
                            <Link href="/professeurs">
                                <ArrowLeft className="mr-2 h-4 w-4" /> List
                                Professeurs
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
