"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { PoolCard } from "./pool-card";

// Mock data for funding pools
const pools = [
  {
    id: "1",
    name: "Community Development Fund",
    description: "Supporting local community projects and initiatives",
    createdAt: "2023-01-15",
    status: "Active",
    totalFunds: 50000,
    matchingRatio: 1.5,
    contributorsCount: 120,
    votersCount: 75,
    applicationsCount: 28,
    pendingApplications: 12,
    approvedApplications: 16,
    distributionMethod: "Quadratic",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "Tech Innovation Grant",
    description: "Funding for innovative technology solutions",
    createdAt: "2023-03-22",
    status: "Active",
    totalFunds: 75000,
    matchingRatio: 2.0,
    contributorsCount: 85,
    votersCount: 50,
    applicationsCount: 35,
    pendingApplications: 18,
    approvedApplications: 17,
    distributionMethod: "Linear",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    name: "Environmental Projects",
    description: "Supporting sustainability and environmental initiatives",
    createdAt: "2023-05-10",
    status: "Pending",
    totalFunds: 35000,
    matchingRatio: 1.2,
    contributorsCount: 65,
    votersCount: 40,
    applicationsCount: 15,
    pendingApplications: 10,
    approvedApplications: 5,
    distributionMethod: "Custom",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    name: "Education Access Fund",
    description: "Providing educational resources to underserved communities",
    createdAt: "2023-02-05",
    status: "Active",
    totalFunds: 60000,
    matchingRatio: 1.8,
    contributorsCount: 95,
    votersCount: 60,
    applicationsCount: 22,
    pendingApplications: 8,
    approvedApplications: 14,
    distributionMethod: "Quadratic",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
];

export function PoolExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter and sort pools
  const filteredPools = pools
    .filter((pool) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          pool.name.toLowerCase().includes(query) ||
          pool.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((pool) => {
      // Apply status filter
      if (statusFilter === "all") return true;
      return pool.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "funds-high":
          return b.totalFunds - a.totalFunds;
        case "funds-low":
          return a.totalFunds - b.totalFunds;
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="">
      {filteredPools.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">No pools found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      )}
    </div>
  );
}
