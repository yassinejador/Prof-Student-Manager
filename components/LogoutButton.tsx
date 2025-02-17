"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); // État pour gérer l'affichage de la fenêtre de confirmation

    const handleLogout = async () => {
        setLoading(true);
        
        try {
            // Supprimer le cookie côté serveur
            await fetch("/api/auth/logout", { method: "POST" });
            setShowConfirmation(false);
            // Redirection vers la page de connexion
            router.push("/auth");
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bouton pour ouvrir la fenêtre de confirmation */}
            <button
                onClick={() => setShowConfirmation(true)} // Affiche la fenêtre de confirmation
                className="px-4 py-2 bg-black text-white w-60 rounded-md hover:bg-black-600 transition mt-20"
            >
                Se déconnecter
            </button>

            {/* Fenêtre de confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Êtes-vous sûr de vouloir vous déconnecter ?</h2>
                        <div className="flex justify-end gap-4">
                            {/* Bouton Annuler */}
                            <button
                                onClick={() => setShowConfirmation(false)} // Ferme la fenêtre de confirmation
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                            >
                                Annuler
                            </button>
                            {/* Bouton Confirmer */}
                            <button
                                onClick={handleLogout} // Déconnecte l'utilisateur
                                disabled={loading}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-black transition"
                            >
                                {loading ? "Déconnexion..." : "Confirmer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}