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
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
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

    // Photo de profil
    if (professeur.user.photo_profil) {
        try {
            const photo = await fetch(`http://localhost:3000/images/users/${professeur.user.photo_profil}`)
            const img = await pdfDoc.embedPng(await photo.buffer())
            page.drawImage(img, {
                x: 60,
                y: 220,
                width: 120,
                height: 120,

            })
        } catch (error) {
            console.error('Erreur lors du chargement de la photo de profil:', error)
        }
    }

    // Nom du professeur
    page.drawText(`${professeur.user.prenom} ${professeur.user.nom}`, {
        x: 200,
        y: 310,
        font,
        size: fontSize,
        color: black,
    })

    // Matières
    const matieres = professeur.MatieresDetails.map((md) => md.matiere.nom).join('.\n')
    page.drawText(`Matières enseignées :\n${matieres}.`, {
        x: 200,
        y: 260,
        font,
        size: smallFontSize,
        color: black,
        lineHeight: 16,
    })

    // QR Code
    const qrUrl = `http://192.168.1.155:3000/api/professeurs/${professeur.id}/details`
    const qrDataUrl = await QRCode.toDataURL(qrUrl)
    const qrImage = await pdfDoc.embedPng(qrDataUrl)
    page.drawImage(qrImage, {
        x: 420,
        y: 220,
        width: 100,
        height: 100,
    })

    // Encadré
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
