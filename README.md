# 🏰 Application de Gestion des Professeurs et Étudiants

## 📚 Description

Application web développée avec **Next.js** pour la gestion des professeurs et des étudiants universitaires.
Fonctionnalités principales :

- Gestion des professeurs (saisie, importation Excel, génération de cartes professionnelles).
- Authentification et gestion des rôles (professeurs et admin).
- Suivi des actions avec un système de logs.

---

## 🛠 Stack Technique

| Catégorie            | Technologies          |
| -------------------- | --------------------- |
| **Framework**        | Next.js 14            |
| **Base de données**  | MySQL 8+              |
| **Authentification** | JWT (JSON Web Tokens) |
| **Style**            | Tailwind CSS          |
| **ORM**              | Prisma                |

---

## ✅ Prérequis

### Vérifications système

1. **Node.js 16.x+** :

   ```bash
   node -v
   ```

   [Télécharger Node.js](https://nodejs.org/) si non installé

2. **npm** (inclus avec Node.js) :

   ```bash
   npm -v
   ```

3. **MySQL 8+** :

   ```bash
   mysql --version
   ```

   [Installer MySQL](https://dev.mysql.com/downloads/)

---

## 🚀 Démarrage Rapide

### 1. Clonage du dépôt

```bash
git clone https://github.com/yassinejador/Prof-Student-Manager.git
cd prof-student-manager
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de l'environnement (`.env`)

#### Copier `.env.example` dans `.env`

```bash
cp .env.example .env
```

#### Puis le configurer :

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=VOTRE_UTILISATEUR
DB_PASSWORD=VOTRE_MDP
DATABASE_URL=mysql://VOTRE_UTILISATEUR:VOTRE_MDP@localhost:3306/db_prof_student_manager
DB_NAME=db_prof_student_manager
JWT_SECRET=VOTRE_JWT_SECRET
```

#### Vous pouvez exécuter la commande suivante pour générer une clé secrète JWT :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Lancer la base de données et appliquer le schéma Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Lancement de l'application

```bash
npm run dev
```

---


## 👥 Contributeurs

| Membre            | GitHub                                            |
| ----------------- | ------------------------------------------------- |
| Oussama TAGHLAOUI | [ouss-tagh-dev](https://github.com/ouss-tagh-dev) |
| Yassmin ELBAZ     | [yassminelbaz](https://github.com/yassminelbaz)   |
| Yassine JADOR     | [yassinejador](https://github.com/yassinejador)   |
| Sanaa AZZA        | [sanaaazza](https://github.com/sanaaazza)         |








