"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Briefcase } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({
    totalProfesseurs: 0,
    totalMatieres: 0,
    totalProfesseursActifs : 0,
    totalProfesseursPermanents: 0,
    totalProfesseursVacataires: 0,
  });

  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/statics"); // Remplace par ton endpoint API réel
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des statistiques");
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Fin du chargement
      }
    }

    fetchStats();
  }, []); // 👈 Exécute une seule fois lors du premier rendu

  if (loading) {
    return <p className="text-center text-gray-500">Chargement des données...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
  <CardContent className="flex justify-center items-center">
    <img src="/logo_ucd.png" alt="Logo de l'université" className="h-32 w-32 object-contain" />
  </CardContent>
</Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Professeurs</CardTitle>
            <Briefcase className="h-6 w-6 text-brown-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseurs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Matières</CardTitle>
            <BookOpen className="h-6 w-6  text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatieres}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professeurs Actifs</CardTitle>
            <Users className="h-6 w-6  text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseursActifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professeurs Permanents</CardTitle>
            <Users className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseursPermanents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professeurs Vacataires</CardTitle>
            <Users className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseursVacataires}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
