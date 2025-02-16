"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'permanent' as 'permanent' | 'vacataire',
    photo_profil: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/professeurs/1/details');
        const data = await response.json();
        setUserData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          statut: data.statut,
          photo_profil: data.photo_profil,
        });
        setPhotoPreview(data.photo_profil ? `/images/users/${data.photo_profil}` : '');
      } catch (error) {
        setAlertMessage({ type: 'error', message: 'Failed to load profile data' });
      }
    };
    fetchUserData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nom', userData.nom);
      formData.append('prenom', userData.prenom);
      formData.append('email', userData.email);
      formData.append('telephone', userData.telephone);
      formData.append('statut', userData.statut);

      const fileInput = document.getElementById('photo_profil') as HTMLInputElement;
      if (fileInput.files?.[0]) {
        formData.append('photo_profil', fileInput.files[0]);
      }

      const response = await fetch('/api/professeurs/1', {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setAlertMessage({ type: 'success', message: 'Le profile a été modifier!' });
        // Update photo preview if new image was uploaded
        if (fileInput.files?.[0]) {
          setPhotoPreview(URL.createObjectURL(fileInput.files[0]));
        }
      } else {
        const error = await response.json();
        setAlertMessage({ type: 'error', message: error.error || 'Echec modification' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Echec modification. Essayer autre fois.' });
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      {/* Alert Message */}
      {alertMessage && (
        <div className={`p-4 rounded-md ${alertMessage.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
          }`}>
          <div className="flex justify-between items-center">
            <span>{alertMessage.message}</span>
            <button
              onClick={() => setAlertMessage(null)}
              className="hover:opacity-75"
            >
              x
            </button>
          </div>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Information Personel</CardTitle>
            <CardDescription>
              Modifiez vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photo_profil">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <Image
                      src={photoPreview}
                      alt="Profile Photo"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <Input
                    id="photo_profil"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom"> Nom</Label>
                <Input
                  id="nom"
                  value={userData.nom}
                  onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={userData.prenom}
                  onChange={(e) => setUserData({ ...userData, prenom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Numéro Téléphone</Label>
                <Input
                  id="telephone"
                  value={userData.telephone}
                  onChange={(e) => setUserData({ ...userData, telephone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Status</Label>
                <Select
                  value={userData.statut}
                  onValueChange={(value) => setUserData({ ...userData, statut: value as typeof userData.statut })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="vacataire">Vacataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Enregistrer</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mot de passe</CardTitle>
            <CardDescription>
            Changez votre mot de passe ici. Veuillez utiliser un mot de passe fort de 8 caractéres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Mot de passe actuel</Label>
                <Input
                  id="current"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">Nouveau mot de passe</Label>
                <Input
                  id="new"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button type="submit">Mettre à jour le mot de passe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
