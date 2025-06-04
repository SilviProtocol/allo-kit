"use client";

import { useState } from "react";
import {
  BarChart,
  Calculator,
  ChevronDown,
  Download,
  LineChart,
  PieChart,
  Settings,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface PoolDistributionProps {
  pool: {
    id: string;
    name: string;
    totalFunds: number;
    distributionMethod?: string;
  };
}

// Mock approved applications data
const approvedProjects = [
  {
    id: "app2",
    title: "Youth Coding Workshops",
    organization: "Tech Education Alliance",
    requestedAmount: 7500,
    votes: 45,
  },
  {
    id: "app4",
    title: "Neighborhood Art Installation",
    organization: "Urban Arts Collective",
    requestedAmount: 6800,
    votes: 32,
  },
  {
    id: "app7",
    title: "Clean Water Initiative",
    organization: "Environmental Action Group",
    requestedAmount: 9200,
    votes: 58,
  },
  {
    id: "app9",
    title: "Homeless Shelter Support",
    organization: "Community Care Network",
    requestedAmount: 12000,
    votes: 72,
  },
  {
    id: "app11",
    title: "Youth Sports Program",
    organization: "Active Kids Foundation",
    requestedAmount: 5500,
    votes: 28,
  },
];

export function PoolDistribution({ pool }: PoolDistributionProps) {
  const [distributionMethod, setDistributionMethod] = useState(
    pool.distributionMethod || "Quadratic"
  );
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [minThreshold, setMinThreshold] = useState(5); // Minimum vote threshold
  const [capAmount, setCapAmount] = useState(10000); // Maximum funding cap
  const [matchingMultiplier, setMatchingMultiplier] = useState(1.5); // Matching multiplier

  // Calculate distributions based on the selected method
  const calculateDistributions = () => {
    const totalVotes = approvedProjects.reduce(
      (sum, project) => sum + project.votes,
      0
    );
    const totalRequestedAmount = approvedProjects.reduce(
      (sum, project) => sum + project.requestedAmount,
      0
    );
    const availableFunds = pool.totalFunds * 0.9; // 90% of pool funds available for distribution

    let distributions = [];

    switch (distributionMethod) {
      case "Linear":
        // Simple proportional distribution based on votes
        distributions = approvedProjects.map((project) => {
          const voteShare = project.votes / totalVotes;
          const allocation = Math.min(
            availableFunds * voteShare,
            project.requestedAmount
          );
          const percentOfRequest = (allocation / project.requestedAmount) * 100;

          return {
            ...project,
            allocation: Math.round(allocation),
            percentOfRequest: Math.round(percentOfRequest),
            calculationDetails: `${project.votes} votes (${Math.round(voteShare * 100)}% of total) × $${Math.round(availableFunds).toLocaleString()} available = $${Math.round(allocation).toLocaleString()}`,
          };
        });
        break;

      case "Quadratic":
        // Quadratic voting gives more weight to projects with broader support
        const sqrtVotes = approvedProjects.map((project) =>
          Math.sqrt(project.votes)
        );
        const totalSqrtVotes = sqrtVotes.reduce((sum, sqrt) => sum + sqrt, 0);

        distributions = approvedProjects.map((project, index) => {
          const quadraticShare = sqrtVotes[index] / totalSqrtVotes;
          const allocation = Math.min(
            availableFunds * quadraticShare,
            project.requestedAmount
          );
          const percentOfRequest = (allocation / project.requestedAmount) * 100;

          return {
            ...project,
            allocation: Math.round(allocation),
            percentOfRequest: Math.round(percentOfRequest),
            calculationDetails: `√${project.votes} = ${sqrtVotes[index].toFixed(2)} (${Math.round(quadraticShare * 100)}% of total) × $${Math.round(availableFunds).toLocaleString()} available = $${Math.round(allocation).toLocaleString()}`,
          };
        });
        break;

      case "Custom":
        // Custom algorithm with thresholds and caps
        distributions = approvedProjects.map((project) => {
          // Apply minimum threshold
          if (project.votes < minThreshold) {
            return {
              ...project,
              allocation: 0,
              percentOfRequest: 0,
              calculationDetails: `Below minimum threshold of ${minThreshold} votes`,
            };
          }

          // Calculate base allocation with matching multiplier
          const voteShare = project.votes / totalVotes;
          let allocation = availableFunds * voteShare * matchingMultiplier;

          // Apply cap
          allocation = Math.min(allocation, capAmount, project.requestedAmount);
          const percentOfRequest = (allocation / project.requestedAmount) * 100;

          return {
            ...project,
            allocation: Math.round(allocation),
            percentOfRequest: Math.round(percentOfRequest),
            calculationDetails: `${project.votes} votes × ${matchingMultiplier}x multiplier, capped at $${capAmount.toLocaleString()} = $${Math.round(allocation).toLocaleString()}`,
          };
        });
        break;

      default:
        distributions = [];
    }

    // Sort by allocation amount (descending)
    return distributions.sort((a, b) => b.allocation - a.allocation);
  };

  const distributions = calculateDistributions();
  const totalAllocated = distributions.reduce(
    (sum, project) => sum + project.allocation,
    0
  );
  const allocationPercentage = (totalAllocated / pool.totalFunds) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Fund Distribution</CardTitle>
              <CardDescription>
                Allocate funds to approved projects based on voting results
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={distributionMethod}
                onValueChange={setDistributionMethod}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Linear">Linear Distribution</SelectItem>
                  <SelectItem value="Quadratic">Quadratic Voting</SelectItem>
                  <SelectItem value="Custom">Custom Algorithm</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible
            open={showAdvancedSettings}
            onOpenChange={setShowAdvancedSettings}
            className="space-y-4"
          >
            <CollapsibleContent className="space-y-4 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Distribution Settings</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min-threshold">Minimum Vote Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="min-threshold"
                      min={0}
                      max={20}
                      step={1}
                      value={[minThreshold]}
                      onValueChange={(value) => setMinThreshold(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center text-sm">
                      {minThreshold}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Projects with fewer votes than this threshold receive no
                    funding
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cap-amount">Maximum Funding Cap</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="cap-amount"
                      type="number"
                      value={capAmount}
                      onChange={(e) => setCapAmount(Number(e.target.value))}
                      className="h-9"
                    />
                    <span className="text-sm">USD</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum amount any single project can receive
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matching-multiplier">
                    Matching Multiplier
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="matching-multiplier"
                      min={1}
                      max={3}
                      step={0.1}
                      value={[matchingMultiplier]}
                      onValueChange={(value) => setMatchingMultiplier(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center text-sm">
                      {matchingMultiplier}x
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multiplier applied to vote-based allocations
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="respect-requested">
                      Respect Requested Amounts
                    </Label>
                    <Switch id="respect-requested" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Never allocate more than the requested amount
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>
                Allocated: ${totalAllocated.toLocaleString()} of $
                {pool.totalFunds.toLocaleString()}
              </div>
              <div>{Math.round(allocationPercentage)}% of total funds</div>
            </div>
            <Progress value={allocationPercentage} className="h-2" />
          </div>

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Allocation Table
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Visualization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b p-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Project</div>
                  <div className="col-span-2 text-right">Votes</div>
                  <div className="col-span-2 text-right">Requested</div>
                  <div className="col-span-3 text-right">Allocation</div>
                </div>
                <div className="divide-y">
                  {distributions.map((project) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-12 gap-4 p-4 text-sm"
                    >
                      <div className="col-span-5">
                        <div className="font-medium">{project.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {project.organization}
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        {project.votes}
                      </div>
                      <div className="col-span-2 text-right">
                        ${project.requestedAmount.toLocaleString()}
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="font-medium">
                          ${project.allocation.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.percentOfRequest}% of requested
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-md border p-4">
                <h3 className="text-sm font-medium">Calculation Method</h3>
                <div className="space-y-1">
                  <Badge variant="outline">{distributionMethod}</Badge>
                  <p className="text-xs text-muted-foreground">
                    {distributionMethod === "Linear" &&
                      "Linear distribution allocates funds proportionally based on the number of votes each project receives."}
                    {distributionMethod === "Quadratic" &&
                      "Quadratic voting gives more weight to projects with broader support by using the square root of votes."}
                    {distributionMethod === "Custom" &&
                      "Custom algorithm applies thresholds, caps, and multipliers to create a tailored distribution."}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-medium">Calculation Details</h4>
                  <div className="space-y-1">
                    {distributions.map((project) => (
                      <div key={project.id} className="text-xs">
                        <span className="font-medium">{project.title}:</span>{" "}
                        {project.calculationDetails}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Button>Finalize Distribution</Button>
              </div>
            </TabsContent>

            <TabsContent value="chart" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Allocation by Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-lg font-medium">
                          Bar Chart Visualization
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This would display a bar chart showing allocation
                          amounts by project.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Percentage of Total Funds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-lg font-medium">
                          Pie Chart Visualization
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This would display a pie chart showing the
                          distribution of funds.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Votes vs. Allocation Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-lg font-medium">
                          Comparison Chart
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This would display a comparison between votes received
                          and funds allocated.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
