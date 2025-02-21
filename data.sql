use db_prof_student_manager;
-- Ajout des utilisateurs
INSERT INTO Users (email, password, role, nom, prenom, telephone, photo_profil) VALUES
('admin.admin@fs.ucd.ac.ma', '$2a$10$bFY46MRnYHQ8T67IvS6LB.C52Gw7U.WMmVj3Io8bwz84urK8WvJ2a','admin', 'Admin', 'Admin','0500005000',  'default-user.png'),
('professeur1@fs.ucd.ac.ma', '$10$PL.XkhteWk56kIi75xMnw.TvF0O0DqkRWz9vjbmqammnIGt3XQ6E6', 'professeur', 'prof', 'Ahmed', '0770204240', 'default-user.png');
;

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
