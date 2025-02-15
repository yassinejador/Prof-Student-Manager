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
import { Metadata } from "next";
import { Professeurs } from "@/types/route";
import { createProfesseur, deleteProfesseur } from "../actions/professeurs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const metadata: Metadata = {
  title: "professeurs",
  description:
    "Liste des professeurs",
};

async function fetchProfesseurs(): Promise<Professeurs[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/professeurs`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch ");
    }

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des professeurs :", error);
    return [];
  }
}

const ProfesseursPage = async () => {
  const professeurs = await fetchProfesseurs();

  const handleDelete = (id: number) => {

  };

  const handleEdit = (id: number) => {

  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-3xl font-bold">Professeurs</h1>
  <Dialog>
    <DialogTrigger asChild>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Professeur
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Professeur</DialogTitle>
      </DialogHeader>
      <form action={createProfesseur}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Entrez l'email"
                
              />
            </div>

            {/* Nom Input */}
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                placeholder="Entrez le nom"
                
              />
            </div>

            {/* Prenom Input */}
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                placeholder="Entrez le prénom"
                
              />
            </div>

            {/* Telephone Input */}
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="Entrez le téléphone"
                
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Entrez le mot de passe"
                
              />
            </div>

            {/* Statut Radio Group */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <RadioGroup
                name="statut"
                defaultValue="permanent"
                className="flex items-center space-x-4"
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

            {/* Photo Input */}
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

          {/* Matieres Multi-Select Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Matières
            </Label>
            <select
              multiple
              name="matieresdetails"
              className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              
            >
              <option value="1">Math</option>
              <option value="2">OOp</option>
              <option value="3">Physique</option>
            </select>
          </div>

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
                <TableHead>Prenom</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professeurs.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>{professor.id}</TableCell>
                  <TableCell>{professor.user.email}</TableCell>
                  <TableCell>{professor.user.nom}</TableCell>
                  <TableCell>{professor.user.prenom}</TableCell>
                  <TableCell>{professor.user.telephone}</TableCell>
                  <TableCell>{String(professor.user.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form action={deleteProfesseur}>
                            <input type="hidden" name="id" value={professor.id} />
                            <button
                              type="submit"
                              className="text-red-500 w-full text-left"
                            >
                              Delete
                            </button>
                          </form>
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
export default ProfesseursPage;