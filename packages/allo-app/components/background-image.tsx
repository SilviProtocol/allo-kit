import type { ComponentPropsWithRef } from "react";
import { cn } from "~/lib/utils";

export const BackgroundImage = ({
  src,
  fallbackSrc,
  isLoading,
  className,
  ...props
}: {
  src?: string;
  fallbackSrc?: string;
  isLoading?: boolean;
} & ComponentPropsWithRef<"div">) => (
  <div
    {...props}
    className={cn(
      "bg-cover bg-center h-full w-full object-cover transition-transform duration-300",
      className,
      {
        ["blur-2xl"]: fallbackSrc && !src,
        ["animate-pulse bg-gray-100"]: isLoading,
      }
    )}
    style={{ backgroundImage: `url("${src ?? fallbackSrc}")` }}
  />
);
