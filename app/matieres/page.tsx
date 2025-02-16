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
import { Matieres } from "@/types/route";

export default function MatieresPage() {
  const [matieres, setMatieres] = useState<Matieres[]>([]);
  const [selectedMatieres, setSelectedMatieres] = useState<Matieres | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMatieresName, setNewMatieresName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add"
  );

  useEffect(() => {
    fetchMatieres();
  }, []);

  const fetchMatieres = () => {
    fetch("/api/matieres")
      .then((response) => response.json())
      .then(setMatieres)
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    fetch(`/api/matieres/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setMatieres(matieres.filter((m) => m.id !== id));
          showSuccess("delete");
        }
      })
      .catch(console.error);
  };

  const showSuccess = (type: "add" | "edit" | "delete") => {
    setOperationType(type);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const handleSubmitMatieres = () => {
    if (selectedMatieres) {
      fetch(`/api/matieres/${selectedMatieres.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMatieres),
      })
        .then((response) => {
          if (response.ok) {
            fetchMatieres();
            setIsEditModalOpen(false);
            showSuccess("edit");
          }
        })
        .catch(console.error);
    }
  };

  const handleAddMatieres = () => {
    if (!newMatieresName.trim()) return;

    fetch("/api/matieres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: newMatieresName }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchMatieres();
        setNewMatieresName("");
        showSuccess("add");
      })
      .catch(console.error);
  };

  const successMessages = {
    add: "Matière ajoutée avec succès !",
    edit: "Matière modifiée avec succès !",
    delete: "Matière supprimée avec succès !",
  };

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-100 p-4 text-green-800">
          {successMessages[operationType]}
        </div>
      )}

      {/* Ajout de matière */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Gestion des Matières</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle matière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Création de matière</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom de la matière</Label>
                <Input
                  value={newMatieresName}
                  onChange={(e) => setNewMatieresName(e.target.value)}
                  placeholder="Saisir le nom..."
                />
              </div>
              <Button onClick={handleAddMatieres}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des matières */}
      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifiant</TableHead>
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
                        <Button variant="ghost" size="sm">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMatieres(matiere);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            setSelectedMatieres(matiere);
                            setIsDeleteDialogOpen(true);
                          }}
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

      {/* Modals */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification de matière</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={selectedMatieres?.nom || ""}
              onChange={(e) =>
                setSelectedMatieres({
                  ...selectedMatieres!,
                  nom: e.target.value,
                })
              }
              placeholder="Nom de la matière"
            />
            <Button onClick={handleSubmitMatieres}>Sauvegarder</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Êtes-vous sûr de vouloir supprimer cette matière ?</p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedMatieres) handleDelete(selectedMatieres.id);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
