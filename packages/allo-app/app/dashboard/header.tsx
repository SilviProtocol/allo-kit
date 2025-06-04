"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ConnectButton } from "~/components/connect-button";
import { FaucetButton } from "~/components/faucet-button";

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <DynamicBreadcrumbs />
        <div className="flex items-center gap-2">
          <ConnectButton />
          <FaucetButton />
        </div>
      </div>
    </header>
  );
}

export const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  pools: "Pools",
  "create-pool": "Create Pool",
  manage: "Manage Pools",
  funds: "Pool Funds",
  distribute: "Distribute",
  view: "View Pool",
  register: "Register Pool",
  applications: "Applications",
  browse: "Browse Applications",
  review: "Review Applications",
  checkout: "Checkout",
};
export function DynamicBreadcrumbs() {
  const pathname = usePathname(); // e.g., "/dashboard/pools/create"
  const segments = pathname.split("/").filter(Boolean); // ['dashboard', 'pools', 'create']

  const pathParts = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: BREADCRUMB_LABELS[segment] ?? segment,
      href,
      isLast: index === segments.length - 1,
    };
  });

  console.log(pathParts);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathParts.map((part, i) => (
          <BreadcrumbItem key={i}>
            {part.isLast ? (
              <BreadcrumbPage>{part.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link href={part.href}>{part.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
