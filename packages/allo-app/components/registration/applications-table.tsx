import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Checkbox } from "~/components/ui/checkbox";
import { BackgroundImage } from "~/components/background-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { Registration } from "~/schemas";
import { useRegistrations } from "./use-register";
import { ApprovedBadge } from "./approved-badge";
import { IndexerQuery } from "~/hooks/use-indexer";
import { DataTable } from "../ui/data-table";

export function ApplicationsTable({
  query,
  renderLink,
}: {
  query: IndexerQuery;
  renderLink?: (registration: Registration) => ReactNode;
}) {
  const { data, error, isPending } = useRegistrations(query);
  const columns: ColumnDef<Registration>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: "Project",
        cell: ({ row }) => {
          const { title, image } = row.original.metadata ?? {};
          return (
            <div
              onClick={() => row.toggleSelected()}
              className="flex flex-1 cursor-pointer gap-4"
            >
              <BackgroundImage
                className="size-12 rounded bg-gray-800"
                src={image}
              />

              <div>
                <h3 className="line-clamp-1 overflow-hidden text-ellipsis text-sm font-semibold text-gray-800">
                  {title}
                </h3>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <ApprovedBadge isApproved={row.original.isApproved} />
        ),
      },
      ...(renderLink
        ? ([
            {
              id: "open",
              cell: ({ row }) => renderLink(row.original),
            },
          ] as ColumnDef<Registration>[])
        : []),
    ],
    []
  );
  return (
    <DataTable
      isLoading={isPending}
      columns={columns}
      data={data?.items ?? []}
      pagination={{ pageSize: 20 }}
      renderFilter={(table) => {
        return (
          <div className="flex justify-between gap-2">
            <Input
              placeholder="Search..."
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
            />
            <Tabs
              className="mb-2"
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(status) =>
                table.getColumn("status")?.setFilterValue(status)
              }
            >
              <TabsList>
                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                <TabsTrigger value="">All</TabsTrigger>
                <TabsContent value="approved"></TabsContent>
              </TabsList>
            </Tabs>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" iconRight={ChevronDown}>
                  Review
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Review selected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }}
    />
  );
}
