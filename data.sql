use db_prof_student_manager;
-- Ajout des utilisateurs
INSERT INTO Users (email, password, role, nom, prenom, telephone, photo_profil) VALUES
('prof1@example.com', 'hashedpassword1', 'professeur', 'Dupont', 'Jean', '0601020304', 'default-user.png'),
('prof2@example.com', 'hashedpassword2', 'professeur', 'Martin', 'Claire', '0601020304', 'default-user.png'),
('admin@example.com', 'hashedpassword3', 'admin', 'Hassan', 'Hs', '0601020304', 'default-user.png');

-- Ajout des professeurs
INSERT INTO Professeurs (user_id, statut, departement) VALUES
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
(1, 'inscription_module', 'Inscription à Algèbre Linéaire et Programmation en C');
