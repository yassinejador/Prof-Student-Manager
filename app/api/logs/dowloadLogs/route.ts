import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const logs = await prisma.logs.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            nom: true,
            prenom: true,
          }
        }
      }
    });

    // Transform the logs data into a format suitable for Excel
    const data = logs.map(log => ({
      id: log.id,
      user_id: log.user_id,
      user_email: log.user.email,
      user_nom: log.user.nom,
      user_prenom: log.user.prenom,
      action_type: log.action_type,
      details: log.details,
      created_at: log.created_at.toISOString()
    }));

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');

    // Generate the Excel file as a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create a response with the Excel file
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="logs.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de récupération" },
      { status: 500 }
    );
  }
}