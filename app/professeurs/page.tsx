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
import Link from "next/link";
import { deleteProfesseur } from "../actions/professeurs";

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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input id="code" placeholder="Enter subject code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input id="name" placeholder="Enter subject name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input id="credits" type="number" placeholder="Enter credits" />
              </div>
              <Button className="w-full">Add Subject</Button>
            </div>
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