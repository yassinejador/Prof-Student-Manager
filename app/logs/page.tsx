"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logs } from "@/types/route";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function LogsPage() {
  const [logs, setLogs] = useState<Logs[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/logs`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const exportToExcel = () => {
    const headers = ["Logs ID", "Nom d'Action", "Email", "Nom", "Prenom", "Date d'action"];
    const data = logs.map((log) => [
      log.id,
      log.action_type,
      log.user.email,
      log.user.nom,
      log.user.prenom,
      new Date(log.created_at).toLocaleDateString(),
    ]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "logs.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Logs</h1>
        <Button onClick={exportToExcel}>Télécharger les logs</Button>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logs ID</TableHead>
                <TableHead>Nom d&apos;Action</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prenom</TableHead>
                <TableHead>Date d&apos;action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.action_type}</TableCell>
                  <TableCell>{log.user.email}</TableCell>
                  <TableCell>{log.user.nom}</TableCell>
                  <TableCell>{log.user.prenom}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}