import Link from "next/link";
import { Calendar, FileText, Users } from "lucide-react";

import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { BackgroundImage } from "~/components/background-image";
import { Pool } from "~/schemas/pool";

export function PoolCard({
  metadata,
  strategy,
  token,
  maxAmount,
  admins,
  address,
  owner,
  createdAt,
  updatedAt,
  className,
}: Pool & { className?: string }) {
  // Format date for display
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate a mock progress percentage
  const progressPercentage = 76;
  //  Math.min(
  //   Math.round((pool.contributorsCount / (pool.contributorsCount + 50)) * 100),
  //   100
  // );

  return (
    <Link href={`/dashboard/pools/${address}`}>
      <Card
        className={cn("h-full overflow-hidden transition-all pt-0", className)}
      >
        {metadata?.image && (
          <BackgroundImage
            src={metadata.image}
            fallbackSrc={metadata.image}
            className="aspect-video bg-gray-100 h-36"
          />
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1 text-lg">
              {metadata?.title}
            </CardTitle>
            <StatusBadge status={status} />
          </div>
          <CardDescription className="line-clamp-2">
            {metadata?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">${maxAmount}</span>
            </div>
            {/* <Progress value={progressPercentage} className="h-2" /> */}
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{10} contributors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{23} voters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{12} applications</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created {formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "outline" = "default";

  switch (status.toLowerCase()) {
    case "active":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "completed":
      variant = "outline";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{status}</Badge>;
}
