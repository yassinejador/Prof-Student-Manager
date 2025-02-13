import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import path from 'path';
import { writeFile } from 'fs/promises';
import * as XLSX from 'xlsx';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const professeurs = await prisma.professeurs.findMany({
      include: { user: true, MatieresDetails: true }
    });
    return NextResponse.json(professeurs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professeurs" },
      { status: 500 }
    );
  }
}

const professeurSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),
  statut: z.enum(['permanent', 'vacataire']),
  matieresdetails: z.array(z.string()),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const ACTION_TYPE = 'CREATE_PROFESSEUR';
  const formData = await request.formData();

  try {
    const excelFile = formData.get('excel_file') as File | null;

    if (excelFile) {
      // Process Excel file upload
      const buffer = Buffer.from(await excelFile.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      const results = [];
      const errors: { row: number; message: string }[] = [];

      for (const [index, row] of rows.entries()) {
        try {
          // Transform and validate data
          const matieresdetails = row.matieresdetails
            ? String(row.matieresdetails).split(',').map(s => s.trim())
            : [];

          const parsedData = professeurSchema.parse({
            nom: String(row.nom),
            prenom: String(row.prenom),
            email: String(row.email),
            telephone: String(row.telephone),
            statut: String(row.statut),
            matieresdetails,
            password: "default-user.png"
          });

          // Process row in transaction
          const result = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash(parsedData.password, 10);

            // Create user
            const user = await tx.users.create({
              data: {
                email: parsedData.email,
                password: hashedPassword,
                role: 'professeur',
                nom: parsedData.nom,
                prenom: parsedData.prenom,
                telephone: parsedData.telephone,
                photo_profil: 'default-user.png'
              }
            });

            // Create professor
            const professeur = await tx.professeurs.create({
              data: {
                user_id: user.id,
                statut: parsedData.statut
              }
            });

            // Create matieres details
            if (parsedData.matieresdetails.length > 0) {
              await tx.matieresDetails.createMany({
                data: parsedData.matieresdetails.map(matiereId => ({
                  professeur_id: professeur.id,
                  matiere_id: Number(matiereId)
                })),
                skipDuplicates: true
              });
            }

            // Create log
            await tx.logs.create({
              data: {
                user_id: user.id,
                action_type: ACTION_TYPE,
                details: JSON.stringify(professeur)
              }
            });

            return { id: professeur.id, email: user.email };
          });

          results.push(result);
        } catch (error) {
          errors.push({
            row: index + 1,
            message: error instanceof z.ZodError
              ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
              : error instanceof Error
              ? error.message
              : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        message: `Processed ${rows.length} rows`,
        successCount: results.length,
        errors
      }, { status: 200 });

    } else {
      // Process single professor form data
      const data = Object.fromEntries(formData.entries());
      const parsedData = professeurSchema.parse({
        ...data,
        matieresdetails: JSON.parse(data.matieresdetails as string)
      });

      // Handle file upload
      const photo = formData.get('photo_profil') as File;
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      const filename = `prof-${Date.now()}${path.extname(photo.name)}`;
      await writeFile(path.join(process.cwd(), 'public/images/users/', filename), photoBuffer);

      // Process in transaction
      const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(parsedData.password, 10);

        const user = await tx.users.create({
          data: {
            email: parsedData.email,
            password: hashedPassword,
            role: 'professeur',
            nom: parsedData.nom,
            prenom: parsedData.prenom,
            telephone: parsedData.telephone,
            photo_profil: filename
          }
        });

        const professeur = await tx.professeurs.create({
          data: {
            user_id: user.id,
            statut: parsedData.statut
          }
        });

        await tx.matieresDetails.createMany({
          data: parsedData.matieresdetails.map((matiereId: string) => ({
            professeur_id: professeur.id,
            matiere_id: Number(matiereId)
          })),
          skipDuplicates: true
        });

        await tx.logs.create({
          data: {
            user_id: user.id,
            action_type: ACTION_TYPE,
            details: JSON.stringify(professeur)
          }
        });

        return professeur;
      });

      return NextResponse.json(result, { status: 201 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Ajoutez ce schéma de validation pour les mises à jour
const professeurUpdateSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telephone: z.string().min(10).optional(),
  statut: z.enum(['permanent', 'vacataire']).optional(),
  password: z.string().min(8).optional()
}).partial();

export async function PATCH(request: Request) {
  return handleUpdate(request);
}

async function handleUpdate(request: Request) {
  const ACTION_TYPE = 'UPDATE_PROFESSEUR';
  const formData = await request.formData();

  try {
    const professeurId = formData.get('professeur_id');
    if (!professeurId) {
      return NextResponse.json({ error: "Professeur ID requis" }, { status: 400 });
    }

    const existingProfesseur = await prisma.professeurs.findUnique({
      where: { id: Number(professeurId) },
      include: { user: true }
    });

    if (!existingProfesseur) {
      return NextResponse.json({ error: "Professeur introuvable" }, { status: 404 });
    }

    const userId = existingProfesseur.user_id;
    const rawData = Object.fromEntries(formData.entries());
    
    // Gestion de la photo séparément
    const photo = formData.get('photo_profil') as File | null;
    delete rawData.photo_profil;
    delete rawData.professeur_id;

    // Validation différente selon le type de mise à jour
    const parsedData = professeurUpdateSchema.parse(rawData);

    // Séparer les données de l'utilisateur et du professeur
    const { statut, ...userData } = parsedData;

    // Traitement de la photo
    let filename = existingProfesseur.user.photo_profil;
    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      filename = `prof-${Date.now()}${path.extname(photo.name)}`;
      await writeFile(path.join(process.cwd(), 'public/images/users/', filename), photoBuffer);
    }

    // Hash du mot de passe si fourni
    const hashedPassword = userData.password 
      ? await bcrypt.hash(userData.password, 10)
      : undefined;

    const result = await prisma.$transaction(async (tx) => {
      // Mise à jour de l'utilisateur
      const updatedUser = await tx.users.update({
        where: { id: userId },
        data: {
          ...userData,
          photo_profil: filename,
          ...(hashedPassword && { password: hashedPassword })
        }
      });

      // Mise à jour du professeur
      const updatedProfesseur = await tx.professeurs.update({
        where: { id: Number(professeurId) },
        data: {
          statut: statut
        }
      });

      // Journalisation
      await tx.logs.create({
        data: {
          user_id: userId,
          action_type: ACTION_TYPE,
          details: JSON.stringify({
            ...userData,
            statut: statut,
            photo_profil: filename,
          })
        }
      });

      return {
        user: updatedUser,
        professeur: updatedProfesseur,
      };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Erreur de validation", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}