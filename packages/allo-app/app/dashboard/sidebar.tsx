"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Coins,
  Home,
  ListTodo,
  Plus,
  SettingsIcon,
  Share2,
  ShieldUser,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Logo } from "~/components/logo";
import { NavItem } from "~/components/sidebar/nav-item";
import {
  usePoolById,
  usePools,
  usePoolsByOwner,
} from "~/components/pool/use-pool";
import { useAccount } from "wagmi";
import { cn } from "~/lib/utils";
import { Address } from "viem";
import { BackgroundImage } from "~/components/background-image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import Link from "next/link";
import { NetworkSelector } from "~/components/network-selector";
import { useRouter, useParams, usePathname, redirect } from "next/navigation";

const menu = {
  sections: [
    {
      name: "",
      items: [
        {
          title: "Dashboard",
          href: "",
          icon: Home,
        },
        {
          title: "Applications",
          href: "/applications",
          icon: ListTodo,
        },
        {
          title: "Pool Funds",
          href: "/funds",
          icon: Coins,
        },
        {
          title: "Distribution",
          href: "/distribution",
          icon: Share2,
        },
        {
          title: "Voters",
          href: "/voters",
          icon: ShieldUser,
        },
        // { // Team is managed in Settings
        //   title: "Team",
        //   href: "/team",
        //   icon: Users,
        // },
        {
          title: "Settings",
          href: "/settings",
          icon: SettingsIcon,
        },
      ],
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { poolAddress } = useParams();

  const { data: pool, isPending } = usePoolById(poolAddress as Address);
  if (poolAddress && !isPending && !pool) {
    redirect("/dashboard");
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Logo href="/" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupContent>
            <PoolSwitcher />
          </SidebarGroupContent>
        </SidebarGroup> */}
        {menu.sections.map((section) => (
          <SidebarGroup key={section.name}>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem
                    className={cn({
                      "opacity-50 pointer-events-none": !poolAddress,
                    })}
                    key={item.title}
                  >
                    <NavItem
                      {...item}
                      href={`/dashboard/${poolAddress}${item.href}`}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NetworkSelector />
      </SidebarFooter>
    </Sidebar>
  );
}

export function PoolSwitcher() {
  const pathname = usePathname();
  const { poolAddress } = useParams();
  const router = useRouter();
  const { data: pools } = usePoolsByOwner();
  const page = pathname.split("/")[3];
  const activePool = pools?.items?.find(
    (pool) =>
      pool.address?.toLowerCase() === (poolAddress as Address)?.toLowerCase()
  );
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <BackgroundImage
                src={activePool?.metadata?.image}
                className="size-8 bg-gray-300 rounded-lg aspect-square"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activePool?.metadata?.title ?? "Select a pool"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Pools
            </DropdownMenuLabel>
            {pools?.items?.map((pool, index) => (
              <DropdownMenuItem
                key={pool.address}
                onClick={() => {
                  router.push(`/dashboard/${pool.address}/${page || ""}`);
                }}
                className={cn("gap-2 p-2", {
                  "bg-sidebar-accent":
                    pool.address?.toLowerCase() ===
                    (poolAddress as Address)?.toLowerCase(),
                })}
              >
                <BackgroundImage
                  src={pool.metadata?.image}
                  className="size-6 bg-gray-300 rounded aspect-square"
                />

                {pool.metadata?.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href="/dashboard/create-pool">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Create new pool
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
