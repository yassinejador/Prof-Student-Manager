export interface ProfesseurCreate {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    statut: 'permanent' | 'vacataire';
    matieres: string[];
    photo_profil?: File;
  }
  
  export interface EtudiantCreate {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    numero_etudiant: string;
    semestre_inscription: number;
  }