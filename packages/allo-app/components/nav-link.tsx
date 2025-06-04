import Link from "next/link";
import { useSelectedLayoutSegment, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const isActive = usePathname() === href;
  return (
    <Link href={href} passHref prefetch>
      <Button
        variant={"link"}
        size="lg"
        className={cn({ ["underline"]: isActive })}
      >
        {children}
      </Button>
    </Link>
  );
}
