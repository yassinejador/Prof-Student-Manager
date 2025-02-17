export enum Role {
    admin = "admin",
    professeur = "professeur",
    etudiant = "etudiant",
  }
  
  export enum Statut {
    permanent = "permanent",
    vacataire = "vacataire",
  }
  
  export type Users = {
    id: number;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    role: Role;
    photo_profil?: string | null;
    created_at: Date;
    updated_at: Date;
    Professeur?: Professeurs | null;
    Logs: Logs[];
  };
  
  export type Professeurs = {
    id: number;
    user_id: number;
    statut: Statut;
    created_at: Date;
    updated_at: Date;
    user: Users;
    MatieresDetails: MatieresDetails[];
  };
  
  export type Matieres = {
    id: number;
    nom: string;
    MatieresDetails: MatieresDetails[];
  };
  
  export type MatieresDetails = {
    id: number;
    professeur_id: number;
    matiere_id: number;
    professeur: Professeurs;
    matiere: Matieres;
  };
  
  export type Logs = {
    id: number;
    user_id: number;
    action_type: string;
    details?: string | null;
    created_at: Date;
    user: Users;
  };