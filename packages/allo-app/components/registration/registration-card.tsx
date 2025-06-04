"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { CheckIcon, Heart, HeartPlus, PlusIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Registration } from "~/schemas";
import { BackgroundImage } from "../background-image";
import { Button } from "../ui/button";
import { EnsName } from "../ens";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ApprovedBadge } from "./approved-badge";
import { NetworkBadge } from "../network-badge";

export function RegistrationCard({
  inCart,
  onSelect,
  isLoading,
  ...project
}: Registration & {
  inCart: boolean;
  isLoading?: boolean;
} & ComponentProps<"button">) {
  const allocations = project?.allocations?.items ?? [];
  const allocation = allocations.reduce((sum, x) => sum + +x.amount, 0);

  return (
    <Card
      className={cn(
        "pt-0 shadow-none aspect-video hover:opacity-90 transition-opacity relative",
        {
          ["animate-pulse"]: isLoading,
        }
      )}
    >
      <div className="absolute flex gap-1 items-center top-2 left-2">
        {/* <ApprovedBadge isApproved={project?.isApproved} /> */}
        <NetworkBadge chainId={project?.chainId} />
      </div>
      <Button
        className="rounded-full absolute top-2 right-2"
        size="icon"
        variant="outline"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault();
          onSelect?.(e);
        }}
        icon={inCart ? Heart : HeartPlus}
        iconProps={inCart ? { fill: "red", stroke: "none" } : {}}
      />
      <BackgroundImage
        src={project?.metadata?.image}
        fallbackSrc={project?.metadata?.image}
        className="aspect-video bg-gray-100 h-36"
      />

      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">{project?.metadata?.title}</CardTitle>
        <div className="flex gap-1 items-center"></div>
      </CardHeader>
    </Card>
  );
  return (
    <Card
      className={cn(
        "pt-0 shadow-none aspect-video hover:opacity-90 transition-opacity relative",
        {
          ["animate-pulse"]: isLoading,
        }
      )}
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-muted rounded-lg w-full" />
      </CardHeader>
      <CardContent className="">
        <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
          {project?.metadata?.title}
        </h3>
      </CardContent>
    </Card>
  );
  return (
    <div
      className={cn("border p-1 rounded flex justify-between", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <div className="flex flex-1 gap-2">
        <BackgroundImage
          src={project?.metadata?.image}
          className="size-16 bg-gray-200 rounded"
        />
        <div className="flex-1">
          <Link href={`/project/${project?.address}`}>
            <h3 className="hover:underline">{project?.metadata?.title}</h3>
          </Link>
          <code className="text-sm">
            <EnsName address={project?.address} />
          </code>
        </div>
        <Button
          size="icon"
          className="rounded-full"
          variant="ghost"
          disabled={isLoading}
          onClick={onSelect}
          icon={inCart ? CheckIcon : PlusIcon}
        />
      </div>
    </div>
  );
}
