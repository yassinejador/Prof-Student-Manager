import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import fetch from 'node-fetch'

export async function generateProfCard(professeur: {
    user: { photo_profil?: string | null; prenom: string; nom: string }
    MatieresDetails: { matiere: { nom: string } }[] 
    id: number
}) {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 400])

    // Chargement des polices
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold) // Police en gras
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica) // Police normale

    const fontSize = 18
    const smallFontSize = 14

    // Couleurs
    const black = rgb(0, 0, 0)
    const gray = rgb(0.9, 0.9, 0.9)

    // Fond du cadre
    page.drawRectangle({
        x: 40,
        y: 50,
        width: 520,
        height: 300,
        color: gray,
        opacity: 0.3,
    })

    // **Titre Université (en haut, à l'intérieur de la carte)**
    page.drawText("Université Chouaib Doukkali - FS El Jadida", {
        x: 150, // Centré horizontalement
        y: 320, // Placé en haut de la carte
        font: boldFont,
        size: fontSize,
        color: black,
    })

    // **Photo de profil (juste en dessous du titre)**
    if (professeur.user.photo_profil) {
        try {
            const photo = await fetch(`http://localhost:3000/images/users/${professeur.user.photo_profil}`)
            const img = await pdfDoc.embedPng(await photo.buffer())
            page.drawImage(img, {
                x: 60,
                y: 150, // Déplacé sous le titre
                width: 120,
                height: 120,
            })
        } catch (error) {
            console.error('Erreur lors du chargement de la photo de profil:', error)
        }
    }

    // **QR Code (à droite de la photo)**
    const qrUrl = `http://localhost:3000/informationsprofcard/${professeur.id}`
    const qrDataUrl = await QRCode.toDataURL(qrUrl)
    const qrImage = await pdfDoc.embedPng(qrDataUrl)
    page.drawImage(qrImage, {
        x: 420,
        y: 160, // Aligné à la même hauteur que la photo
        width: 100,
        height: 100,
    })

    // **Nom du professeur et Matières enseignées (niveau de la photo)**
    const namePositionY = 190; // Même niveau que la photo et le QR code

    // Nom du professeur
    page.drawText(`Pr. ${professeur.user.prenom} ${professeur.user.nom}`, {
        x: 200,
        y: namePositionY + 60, // Déplacé un peu plus bas pour ne pas chevaucher la photo
        font: boldFont,
        size: fontSize,
        color: black,
    })

    // Matières enseignées
    const matieres = professeur.MatieresDetails.map((md) => md.matiere.nom).join('\n')

    page.drawText("Matières enseignées :", {
        x: 200,
        y: namePositionY + 20, // Placer juste au-dessus du nom
        font: boldFont, // Titre en gras
        size: smallFontSize,
        color: black, 
    })

    page.drawText(matieres, {
        x: 200,
        y: namePositionY , // Position sous le titre des matières
        font: regularFont, // Police normale pour les matières
        size: smallFontSize,
        color: rgb(0, 0, 0), // Couleur noire
        lineHeight: 16,
    })

    // **Encadré**
    page.drawRectangle({
        x: 40,
        y: 50,
        width: 520,
        height: 300,
        borderWidth: 2,
        borderColor: black,
    })

    return await pdfDoc.save()
}
