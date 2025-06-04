import { CalendarIcon, CheckCircle2, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Pool } from "~/schemas/pool";
import { PoolForm } from "./pool-form";

export function PoolDetails({ pool }: { pool: Pool }) {
  if (!pool) return null;
  // Format date for display
  const formattedDate = new Date(pool.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{pool.metadata.title}</CardTitle>
            {/* <Badge variant={pool.status === "Active" ? "default" : "secondary"}>
              {pool.status}
            </Badge> */}
          </div>
          <CardDescription>{pool.metadata.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Created on {formattedDate}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated 2 days ago
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Pool Settings</CardTitle>
          <CardDescription>Configuration and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Funding Type</p>
              <p className="text-sm text-muted-foreground">Matching Pool</p>
            </div>
            <div>
              <p className="text-sm font-medium">Voting Method</p>
              <p className="text-sm text-muted-foreground">Quadratic</p>
            </div>
            <div>
              <p className="text-sm font-medium">Minimum Contribution</p>
              <p className="text-sm text-muted-foreground">$10</p>
            </div>
            <div>
              <p className="text-sm font-medium">Maximum Contribution</p>
              <p className="text-sm text-muted-foreground">$5,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
          <CardDescription>Who can participate</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span className="text-sm">KYC verification required</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span className="text-sm">Minimum account age: 30 days</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span className="text-sm">Badge holders get 2x voting power</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span className="text-sm">Open to all geographic regions</span>
            </li>
          </ul>
        </CardContent>
      </Card> */}
    </div>
  );
}
