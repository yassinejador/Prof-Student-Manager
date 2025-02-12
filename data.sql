use db_prof_student_manager;
-- Ajout des utilisateurs
INSERT INTO Users (email, password, role, nom, prenom, telephone, photo_profil) VALUES
('prof1@example.com', 'hashedpassword1', 'professeur', 'Dupont', 'Jean', '0601020304', 'prof-1739320958895.jpg'),
('prof2@example.com', 'hashedpassword2', 'professeur', 'Martin', 'Claire', '0601020304', 'prof-1739320958895.jpg'),
('etudiant1@example.com', 'hashedpassword3', 'etudiant', 'Durand', 'Paul', '0601020304', 'prof-1739320958895.jpg'),
('etudiant2@example.com', 'hashedpassword4', 'etudiant', 'Moreau', 'Sophie', '0601020304', 'prof-1739320958895.jpg');

-- Ajout des professeurs
INSERT INTO Professeurs (user_id, statut) VALUES
(1, 'permanent'),
(2, 'vacataire');

-- Ajout des matières
INSERT INTO Matieres (professeur_id, nom) VALUES
(1, 'Mathématiques'),
(1, 'Physique'),
(2, 'Informatique');

-- Ajout des étudiants
INSERT INTO Etudiants (user_id, numero_etudiant, semestre_inscription) VALUES
(3, 'E12345', 1),
(4, 'E67890', 2);

-- Ajout des modules
INSERT INTO Modules (nom, semestre) VALUES
('Algèbre Linéaire', 1),
('Programmation en C', 1),
('Analyse Mathématique', 2),
('Bases de Données', 2);

-- Inscription des étudiants aux modules
INSERT INTO EtudiantModules (etudiant_id, module_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4);

-- Ajout des logs
INSERT INTO Logs (user_id, action_type, details) VALUES
(1, 'connexion', 'Connexion réussie'),
(2, 'ajout_matiere', 'Ajout de la matière Informatique'),
(3, 'inscription_module', 'Inscription à Algèbre Linéaire et Programmation en C');
