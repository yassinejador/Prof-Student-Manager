DROP DATABASE IF EXISTS db_prof_student_manager;
CREATE DATABASE IF NOT EXISTS db_prof_student_manager;
USE db_prof_student_manager;
CREATE TABLE `Users`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL, 
    `telephone` VARCHAR(255) NOT NULL,
    `role` ENUM('professeur', 'etudiant') NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `Users` ADD UNIQUE `users_email_unique`(`email`);
CREATE TABLE `Professeurs`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `statut`  ENUM('permanent', 'vacataire')  NOT NULL,
    `photo_profil` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
CREATE TABLE `Matieres`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `professeur_id` INT NOT NULL,
    `nom` VARCHAR(100) NOT NULL
);
ALTER TABLE
    `Matieres` ADD UNIQUE `matieres_nom_unique`(`nom`);
CREATE TABLE `Etudiants`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `nom` VARCHAR(50) NOT NULL,
    `prenom` VARCHAR(50) NOT NULL,
    `numero_etudiant` VARCHAR(20) NOT NULL,
    `semestre_inscription` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `Etudiants` ADD UNIQUE `etudiants_numero_etudiant_unique`(`numero_etudiant`);
CREATE TABLE `Modules`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(100) NOT NULL,
    `semestre` INT NOT NULL
);
CREATE TABLE `EtudiantModules`(
    `etudiant_id` INT NOT NULL,
    `module_id` INT NOT NULL
);
CREATE TABLE `Logs`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `action_type` VARCHAR(50) NOT NULL,
    `details` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `Professeurs` ADD CONSTRAINT `professeurs_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `Etudiants` ADD CONSTRAINT `etudiants_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `Matieres` ADD CONSTRAINT `matieres_professeur_id_foreign` FOREIGN KEY(`professeur_id`) REFERENCES `Professeurs`(`id`);
ALTER TABLE
    `Logs` ADD CONSTRAINT `logs_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`);
ALTER TABLE
    `EtudiantModules` ADD CONSTRAINT `etudiantmodules_etudiant_id_foreign` FOREIGN KEY(`etudiant_id`) REFERENCES `Etudiants`(`id`);
ALTER TABLE
    `EtudiantModules` ADD CONSTRAINT `etudiantmodules_module_id_foreign` FOREIGN KEY(`module_id`) REFERENCES `Modules`(`id`);