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
INSERT INTO Matieres ( nom) VALUES
('Mathématiques'),
('Physique'),
('Informatique');

INSERT INTO matieresdetails (professeur_id, matiere_id) VALUES
(1,1),
(2,2),
(1,3);

-- Ajout des logs
INSERT INTO Logs (user_id, action_type, details) VALUES
(1, 'connexion', 'Connexion réussie'),
(2, 'ajout_matiere', 'Ajout de la matière Informatique'),
(3, 'inscription_module', 'Inscription à Algèbre Linéaire et Programmation en C');
