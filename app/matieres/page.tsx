"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, EllipsisVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Définir le type pour une Matière
interface Matiere {
  id: number;
  nom: string;
}

export default function MatieresPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newMatiereName, setNewMatiereName] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // Nouveaux états

  // Récupérer les matières depuis l'API avec fetch
  useEffect(() => {
    fetch("/api/matieres")
      .then((response) => response.json())
      .then((data: Matiere[]) => setMatieres(data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des matières :", error);
      });
  }, []);

  const handleDelete = (id: number) => {
    fetch(`/api/matieres/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setMatieres(matieres.filter((matiere) => matiere.id !== id));
        } else {
          console.error("Erreur lors de la suppression de la matière");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleEdit = (matiere: Matiere) => {
    setSelectedMatiere(matiere);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMatiere(null);
    setIsEditModalOpen(false);
    setIsSuccess(false);
  };

  const handleSave = () => {
    if (selectedMatiere) {
      fetch(`/api/matieres/${selectedMatiere.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: selectedMatiere.nom }),
      })
        .then((response) => {
          if (response.ok) {
            setMatieres(
              matieres.map((matiere) =>
                matiere.id === selectedMatiere.id ? selectedMatiere : matiere
              )
            );
            handleCloseModal();
          } else {
            console.error("Erreur lors de la mise à jour de la matière");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour :", error);
        });
    }
  };

  const handleAdd = () => {
    if (!newMatiereName.trim()) {
      alert("Veuillez entrer un nom pour la matière.");
      return;
    }

    const newMatiere = {
      nom: newMatiereName,
    };

    fetch("/api/matieres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMatiere),
    })
      .then((response) => response.json())
      .then((data: Matiere) => {
        setMatieres([...matieres, data]);
        setNewMatiereName("");
        setIsSuccess(true);
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de la matière :", error);
      });
  };

  const openDeleteDialog = (matiere: Matiere) => {
    setSelectedMatiere(matiere);
    setIsDeleteDialogOpen(true); // Ouvre le dialog de suppression
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedMatiere(null);
  };

  const confirmDelete = () => {
    if (selectedMatiere) {
      handleDelete(selectedMatiere.id);
      closeDeleteDialog();
    }
  };

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-100 p-4 text-green-800">
          Matière ajoutée avec succès !
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Matières</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter matière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle matière</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom matière</Label>
                <Input
                  id="name"
                  value={newMatiereName}
                  onChange={(e) => setNewMatiereName(e.target.value)}
                  placeholder="Entrer le nom"
                />
              </div>
              <Button className="w-full" onClick={handleAdd}>
                Ajouter Matière
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identidiant</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matieres.map((matiere) => (
                <TableRow key={matiere.id}>
                  <TableCell>{matiere.id}</TableCell>
                  <TableCell>{matiere.nom}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(matiere)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(matiere)}
                          className="text-red-500"
                        >
                          Supprimer
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

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de la suppression</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Êtes-vous sûr de vouloir supprimer cette matière ?</p>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={closeDeleteDialog}>
                Annuler
              </Button>
              <Button className="bg-red-500" onClick={confirmDelete}>
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Matière</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom matière</Label>
              <Input
                id="edit-name"
                value={selectedMatiere?.nom || ""}
                onChange={(e) =>
                  setSelectedMatiere({
                    ...selectedMatiere!,
                    nom: e.target.value,
                  })
                }
                placeholder="Entrer le nom"
              />
            </div>
            <Button className="w-full" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
