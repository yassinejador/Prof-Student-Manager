"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alerts/Alert";
// Assurez-vous d'avoir ce composant

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("user"); // Valeur par défaut
  const [statut, setStatut] = useState("permanent");
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "danger" | "info";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin ? { email, password } : { nom, prenom, telephone, role, email, password, statut, photoProfil: "default-user.png" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Une erreur s'est produite");

      if (isLogin) {
        console.log("Données reçues après connexion :", data);
        setAlert({ message: "Connexion réussie !", type: "success" });
        // Vérifie que le token est bien stocké
        localStorage.setItem("token", data.token); // Stocker le token
        
        router.refresh(); // Redirection après connexion
      } else {
        setAlert({ message: "Compte créé ! Vous pouvez maintenant vous connecter.", type: "success" });
        setIsLogin(true); // Basculer vers le formulaire de connexion après inscription
      }
    } catch (err: any) {
      setAlert({ message: err.message, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-[1400px] rounded-xl border border-stroke bg-white shadow-default">
        <Link href="/" className="flex justify-center" aria-label="Logo Faculté des Sciences El Jadida">
          <Image
            src="/images/logo/logo_ucd.png"
            alt="Logo FS El Jadida"
            width={100}
            height={40}
            className="h-auto w-auto text-center"
            priority
          />
        </Link>

        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 p-6 sm:p-12 xl:p-16">
            <div className="mb-8 text-center lg:hidden">
              <h1 className="text-xl font-bold text-gray-800">Shcool Managment System</h1>
            </div>
            <h2 className="mb-8 text-2xl font-bold text-primary">
              {isLogin ? "Connexion à votre compte" : "Créer un compte"}
            </h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div >
                    <label htmlFor="nom" className="mb-2.5 block font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      id="nom"
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="mb-2.5 block font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="mb-2.5 block font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                      placeholder="Votre téléphone"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="mb-2.5 block font-medium text-gray-700">
                      Rôle
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                      required
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="professeur">Professeur</option>
                    </select>
                  </div>
                  {role === "professeur" && (
                    <div>
                      <label htmlFor="statut" className="mb-2.5 block font-medium text-gray-700">
                        Statut du professeur
                      </label>
                      <select
                        id="statut"
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                        required
                      >
                        <option value="permanent">Permanent</option>
                        <option value="vacataire">Vacataire</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="w-full" >
                <label htmlFor="email" className="mb-2.5 block font-medium text-gray-700 w-full ">
                  Email professionnel
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                  placeholder="nom.prenom@fs.ucd.ac.ma"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2.5 block font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-6 py-4 text-gray-800 outline-none transition focus:border-primary"
                  placeholder="Votre mot de passe"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-4 text-white transition hover:bg-primary/90 focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              >
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                className="text-blue-500 font-medium ml-1 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}