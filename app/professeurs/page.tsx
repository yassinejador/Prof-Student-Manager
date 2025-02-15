"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, EllipsisVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Professeurs } from "@/types/route";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfesseursPage() {
  const [professeurs, setProfesseurs] = useState<Professeurs[]>([]);
  const [inputMethod, setInputMethod] = useState<"manual" | "xlsx">("manual");
  const router = useRouter();

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const fetchProfesseurs = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/professeurs`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProfesseurs(data || []);
    } catch (error) {
      console.error("Error fetching professeurs:", error);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = new FormData();

    if (inputMethod === "manual") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const nom = formData.get("nom") as string;
      const prenom = formData.get("prenom") as string;
      const telephone = formData.get("telephone") as string;
      const statut = formData.get("statut") as string;
      const photo_profil = formData.get("photo_profil") as File;

      if (!email || !password || !nom || !prenom || !telephone || !statut ||(!photo_profil || photo_profil.size === 0)) {
        alert("Please fill all required fields for manual entry.");
        return;
      }

      data.append("email", email);
      data.append("password", password);
      data.append("nom", nom);
      data.append("prenom", prenom);
      data.append("telephone", telephone);
      data.append("statut", statut);
      data.append("photo_profil", photo_profil);
      data.append("matieresdetails", "[\"1\",\"2\"]");
    } else {
      const file = formData.get("excel_file") as File;
      if (!file || file.size === 0) {
        alert("Please upload an XLSX file.");
        return;
      }
      data.append("excel_file", file);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/professeurs`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to create professor");
      fetchProfesseurs();
      (document.getElementById("create-dialog-trigger") as HTMLButtonElement)?.click();
    } catch (error) {
      console.error("Error creating professor:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/professeurs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete professor");
      fetchProfesseurs();
    } catch (error) {
      console.error("Error deleting professor:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Professeurs</h1>
        <Dialog>
          <DialogTrigger id="create-dialog-trigger" asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter Professeur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter Nouveau Professeur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <RadioGroup
                  value={inputMethod}
                  onValueChange={(value: "manual" | "xlsx") => setInputMethod(value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Entré manuel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xlsx" id="xlsx" />
                    <Label htmlFor="xlsx">Importer XLSX</Label>
                  </div>
                </RadioGroup>

                {inputMethod === "manual" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Entrez l'email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          name="nom"
                          placeholder="Entrez le nom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          placeholder="Entrez le prénom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          placeholder="Entrez le téléphone"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Entrez le mot de passe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Statut</Label>
                        <RadioGroup
                          name="statut"
                          defaultValue="permanent"
                          className="flex items-center space-x-4"
                          required
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="permanent" id="r2" />
                            <Label htmlFor="r2">Permanent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vacataire" id="r3" />
                            <Label htmlFor="r3">Vacataire</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photo_profil">Photo de Profil</Label>
                        <Input
                          id="photo_profil"
                          name="photo_profil"
                          type="file"
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                      Matières
                      </Label>
                      <select
                        multiple
                        name="matieresdetails"
                        className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="1">Math</option>
                        <option value="2">Physique</option>
                        <option value="3">Informatique</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="excel_file">Ajouter des professeurs via fichier XLSX</Label>
                    <Input
                      id="excel_file"
                      name="excel_file"
                      type="file"
                      accept=".xlsx"
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full">
                Ajouter Professeur
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professeur ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Crée en</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professeurs.map((professor) => (
                <TableRow className="cursor-pointer" key={professor.id}>
                  <TableCell>{professor.id}</TableCell>
                  <TableCell>{professor.user.email}</TableCell>
                  <TableCell>{professor.user.nom}</TableCell>
                  <TableCell>{professor.user.prenom}</TableCell>
                  <TableCell>{professor.user.telephone}</TableCell>
                  <TableCell>{new Date(professor.user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/professeurs/${professor.id}`}>
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`http://localhost:3000/api/professeurs/${professor.id}/card`}>
                            Carte Professionnelle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(professor.id)}>
                          <span className="text-red-500">Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
