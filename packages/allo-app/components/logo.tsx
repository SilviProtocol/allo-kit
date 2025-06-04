import Link from "next/link";

import { SparklesIcon } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} prefetch className="flex items-center gap-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
        <SparklesIcon className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">AlloGrants</span>
      </div>
    </Link>
  );
}
