import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import { $Enums } from '@prisma/client';
import sharp from 'sharp';

export async function generateProfCard(professeur: { 
    user: { 
        id: number; email: string; password: string; nom: string; prenom: string; 
        telephone: string; role: $Enums.Role; photo_profil: string | null; 
        created_at: Date; updated_at: Date; 
    };  
    id: number; created_at: Date; updated_at: Date; user_id: number; statut: $Enums.Statut;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Polices
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Couleurs bleu
    const primaryColor = rgb(0.1, 0.4, 0.8);  // Bleu clair
    const secondaryColor = rgb(0.0, 0.2, 0.5);  // Bleu foncé

    // Bandeau supérieur avec dégradé bleu
    page.drawRectangle({
        x: 40, y: 330, width: 520, height: 50, color: primaryColor
    });

    // Logo avant le texte "FACULTY OF SCIENCES EL JADIDA"
try {
    const logoPath = 'public/logo_ucd.png'; // Chemin vers l'image du logo
    const logoBuffer = await sharp(logoPath).png().toBuffer();
    const logoImg = await pdfDoc.embedPng(logoBuffer);

    // Position du logo dans le bandeau
    page.drawImage(logoImg, { x: 60, y: 330, width: 50, height: 50 });
} catch (error) {
    console.error('Erreur lors du chargement du logo:', error);
}

// Texte sur le bandeau

    // Texte sur le bandeau
    page.drawText("FACULTY OF SCIENCES EL JADIDA", {
        x: 150, y: 350, font: boldFont, size: 16, color: rgb(1, 1, 1),
    });

    // Bandeau latéral droit avec un bleu plus foncé
    page.drawRectangle({ 
        x: 460, y: 50, width: 100, height: 280, color: secondaryColor 
    });

    // Cadre autour de l'image
    page.drawRectangle({
        x: 40, y: 50, width: 420, height: 280, color: rgb(0, 0, 0), borderWidth: 1
    });

    page.drawRectangle({
        x: 40, 
        y: 50, 
        width: 420, 
        height: 280, 
        color: rgb(1, 1, 1), // Remplissage blanc
        borderColor: primaryColor, // Bordure en bleu
        borderWidth: 1 // Largeur de la bordure
    });
    
    // Photo du professeur
    if (professeur.user.photo_profil) {
        try {
            const photo = await fetch(`http://localhost:3000/images/users/${professeur.user.photo_profil}`);
            const photoArrayBuffer = await photo.arrayBuffer(); // Utilisation de arrayBuffer()
            const photoUint8Array = new Uint8Array(photoArrayBuffer); // Convertir en Uint8Array
            const img = await pdfDoc.embedPng(photoUint8Array);
            page.drawImage(img, { x: 50, y: 180, width: 100, height: 100 });
        } catch (error) {
            console.error('Erreur lors du chargement de la photo de profil:', error);
        }
    }
    
    // Nom du professeur
    page.drawText("Professeur", {
        x: 180, y: 270, font: boldFont, size: 18, color: primaryColor,
    });
    page.drawText(`${professeur.user.prenom} ${professeur.user.nom}`, {
        x: 180, y: 250, font: boldFont, size: 16, color: rgb(0, 0, 0),
    });

    // Téléphone avec icône locale
    try {
        const phoneIconPath = 'public/telephone.png'; // Assurez-vous que l'image est bien dans ce dossier
        const phoneIconBuffer = fs.readFileSync(phoneIconPath);
        const phoneImg = await pdfDoc.embedPng(phoneIconBuffer);
        page.drawImage(phoneImg, { x: 180, y: 220, width: 16, height: 16 });
    } catch (error) {
        console.error('Erreur lors du chargement de l\'icône téléphone:', error);
    }

    // Numéro de téléphone
    page.drawText(`Téléphone : ${professeur.user.telephone}`, {
        x: 200, y: 220, font: regularFont, size: 14, color: rgb(0, 0, 0),
    });

    // Email avec icône locale
    try {
        const emailIconPath = 'public/poster.png'; // Assurez-vous que l'image est bien dans ce dossier
        const emailIconBuffer = fs.readFileSync(emailIconPath);
        const emailImg = await pdfDoc.embedPng(emailIconBuffer);
        page.drawImage(emailImg, { x: 180, y: 200, width: 16, height: 16 });
    } catch (error) {
        console.error('Erreur lors du chargement de l\'icône email:', error);
    }

    // Email
    page.drawText(`Email : ${professeur.user.email}`, {
        x: 200, y: 200, font: regularFont, size: 14, color: rgb(0, 0, 0),
    });

    // Statut avec icône locale
    try {
        const statutIconPath = 'public/statut.png'; // Assurez-vous que l'image est bien dans ce dossier
        const statutIconBuffer = fs.readFileSync(statutIconPath);
        const statutImg = await pdfDoc.embedPng(statutIconBuffer);
        page.drawImage(statutImg, { x: 180, y: 180, width: 16, height: 16 });
    } catch (error) {
        console.error('Erreur lors du chargement de l\'icône statut:', error);
    }

    // Statut
    page.drawText(`Statut : ${professeur.statut}`, {
        x: 200, y: 180, font: regularFont, size: 14, color: rgb(0, 0, 0),
    });

    // QR Code
    const qrUrl = `http://localhost:3000/informationsprofcard/${professeur.id}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl);
    const qrImage = await pdfDoc.embedPng(qrDataUrl);  // Assurez-vous que le QR code est bien intégré
    page.drawImage(qrImage, { x: 470, y: 170, width: 80, height: 80 });

    // Pied de page
    page.drawText("EL JADIDA", {
        x: 260, y: 30, font: boldFont, size: 14, color: primaryColor,
    });

    return await pdfDoc.save();
}
