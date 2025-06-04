"use client";

import type React from "react";

import { useState } from "react";
import { Download, Search, Upload, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Label } from "~/components/ui/label";

interface PoolVotersProps {
  pool: {
    id: string;
    name: string;
    votersCount: number;
  };
}

// Helper function to truncate Ethereum addresses
const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Mock ENS data - in a real app, this would be fetched from the Ethereum network
const ensNames: Record<string, string | null> = {
  "0x1234567890123456789012345678901234567890": "alice.eth",
  "0x2345678901234567890123456789012345678901": "bob.eth",
  "0x3456789012345678901234567890123456789012": "carol.eth",
  "0x4567890123456789012345678901234567890123": null,
  "0x5678901234567890123456789012345678901234": "dave.eth",
  "0x6789012345678901234567890123456789012345": null,
  "0x7890123456789012345678901234567890123456": "eve.eth",
  "0x8901234567890123456789012345678901234567": null,
};

// Mock data for voters
const initialVoters = [
  {
    address: "0x1234567890123456789012345678901234567890",
    votes: 25,
    joinedDate: "2023-01-10",
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    votes: 18,
    joinedDate: "2023-02-15",
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    votes: 32,
    joinedDate: "2023-01-05",
  },
  {
    address: "0x4567890123456789012345678901234567890123",
    votes: 12,
    joinedDate: "2023-03-20",
  },
  {
    address: "0x5678901234567890123456789012345678901234",
    votes: 28,
    joinedDate: "2023-02-01",
  },
];

export function PoolVoters({ pool }: PoolVotersProps) {
  const [voters, setVoters] = useState(initialVoters);
  const [searchQuery, setSearchQuery] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importError, setImportError] = useState("");

  // Filter voters based on search query
  const filteredVoters = voters.filter((voter) => {
    const address = voter.address.toLowerCase();
    const ensName = ensNames[voter.address]?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return address.includes(query) || ensName.includes(query);
  });

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);

      try {
        // Parse CSV content
        const lines = content.split("\n");
        const headers = lines[0].split(",");

        // Validate headers
        if (!headers.includes("address")) {
          setImportError("CSV must include an 'address' column");
          setPreviewData([]);
          return;
        }

        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(",");
          const row: Record<string, string> = {};

          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || "";
          });

          // Validate Ethereum address format
          if (!/^0x[a-fA-F0-9]{40}$/.test(row.address)) {
            setImportError(
              `Invalid Ethereum address format in row ${i}: ${row.address}`
            );
            setPreviewData([]);
            return;
          }

          data.push(row);
        }

        setPreviewData(data);
        setImportError("");
      } catch (error) {
        setImportError("Error parsing CSV file. Please check the format.");
        setPreviewData([]);
      }
    };

    reader.readAsText(file);
  };

  // Import voters from CSV
  const importVoters = () => {
    if (previewData.length === 0) return;

    const newVoters = previewData.map((row) => ({
      address: row.address,
      votes: Number.parseInt(row.votes || "0", 10),
      joinedDate: new Date().toISOString().split("T")[0],
    }));

    // Merge with existing voters, avoiding duplicates
    const existingAddresses = new Set(voters.map((v) => v.address));
    const uniqueNewVoters = newVoters.filter(
      (v) => !existingAddresses.has(v.address)
    );

    setVoters([...voters, ...uniqueNewVoters]);
    setImportDialogOpen(false);
    setCsvContent("");
    setPreviewData([]);
  };

  // Generate sample CSV
  const generateSampleCSV = () => {
    return "address,votes\n0x1234567890123456789012345678901234567890,10\n0x2345678901234567890123456789012345678901,5";
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sample = generateSampleCSV();
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_voters.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle>Voters</CardTitle>
            <CardDescription>
              Manage voters for this funding pool
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={downloadSampleCSV}>
              <Download className="mr-2 h-4 w-4" />
              Sample CSV
            </Button>
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Voters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Import Voters from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with Ethereum addresses and optional vote
                    counts.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="csv-file">Upload CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      CSV should have an 'address' column with Ethereum
                      addresses and an optional 'votes' column.
                    </p>
                  </div>

                  {importError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {importError}
                    </div>
                  )}

                  {previewData.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Preview ({previewData.length} voters)
                      </h4>
                      <div className="max-h-[200px] overflow-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Address</TableHead>
                              <TableHead>Votes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.slice(0, 5).map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-xs">
                                  {truncateAddress(row.address)}
                                </TableCell>
                                <TableCell>{row.votes || "0"}</TableCell>
                              </TableRow>
                            ))}
                            {previewData.length > 5 && (
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  className="text-center text-sm text-muted-foreground"
                                >
                                  + {previewData.length - 5} more voters
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setImportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={importVoters}
                    disabled={previewData.length === 0 || importError !== ""}
                  >
                    Import {previewData.length} Voters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Total: {voters.length}</span>
          </Badge>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by address or ENS..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>ENS Name</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVoters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No voters found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVoters.map((voter) => (
                  <TableRow key={voter.address}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {voter.address.substring(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{truncateAddress(voter.address)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ensNames[voter.address] ? (
                        <Badge variant="outline">
                          {ensNames[voter.address]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No ENS
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{voter.votes}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(voter.joinedDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
