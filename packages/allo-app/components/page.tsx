import { PropsWithChildren, ReactNode } from "react";
import { BackButton } from "./back-button";

export function Page({
  actions,
  backLink,
  title,
  description,
  children,
}: PropsWithChildren<{
  actions?: ReactNode;
  backLink?: string;
  title: string | ReactNode;
  description?: string;
}>) {
  return (
    <>
      <div className="mb-2 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground py-2">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">{actions}</div>
      </div>
      {children}
    </>
  );
}
