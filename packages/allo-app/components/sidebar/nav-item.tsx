"use client";

import { LucideIcon, PlusCircleIcon } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { createElement, ReactNode } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function NavItem({
  title,
  href,
  icon,
  image,
}: {
  title: string;
  href: string;
  icon?: LucideIcon;
  image?: ReactNode;
  path?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton
      asChild
      // isActive={isActive}
      tooltip={title}
      className={cn({
        ["bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"]:
          isActive,
      })}
      //   className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
    >
      <Link href={href} prefetch>
        {icon ? createElement(icon, { className: "size-4" }) : null}
        {image ? image : null}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
