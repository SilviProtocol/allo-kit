"use client";
import { Search, SlidersHorizontal } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { useState } from "react";

export function PoolFilter() {
  const [filter, setFilter] = useState({
    query: "",
    status: "all",
    sort: "newest",
  });
  return (
    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search pools..."
          className="w-full pl-8"
          value={filter.query}
          onChange={(e) => setFilter({ ...filter, query: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">
                Active
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">
                Pending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">
                Completed
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filter.sort}
              onValueChange={(value) => setFilter({ ...filter, sort: value })}
            >
              <DropdownMenuRadioItem value="newest">
                Newest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">
                Oldest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="funds-high">
                Highest Funds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="funds-low">
                Lowest Funds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name-az">
                Name (A-Z)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name-za">
                Name (Z-A)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
