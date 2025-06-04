"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  Search,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface PoolApplicationsProps {
  pool: {
    id: string;
    name: string;
    applicationsCount?: number;
    pendingApplications?: number;
    approvedApplications?: number;
  };
}

// Mock application data
const applications = [
  {
    id: "app1",
    title: "Community Garden Initiative",
    organization: "Green Spaces Collective",
    contact: "Sarah Johnson",
    requestedAmount: 5000,
    description:
      "Creating sustainable community gardens in urban neighborhoods to promote food security and community engagement.",
    submittedDate: "2023-05-15",
    status: "pending",
    votes: 0,
  },
  {
    id: "app2",
    title: "Youth Coding Workshops",
    organization: "Tech Education Alliance",
    contact: "Michael Chen",
    requestedAmount: 7500,
    description:
      "Providing free coding workshops for underprivileged youth to develop technical skills and career opportunities.",
    submittedDate: "2023-05-10",
    status: "approved",
    votes: 45,
  },
  {
    id: "app3",
    title: "Senior Digital Literacy Program",
    organization: "Silver Tech Connect",
    contact: "Elizabeth Parker",
    requestedAmount: 4200,
    description:
      "Teaching digital literacy skills to seniors to help them stay connected with family and access essential online services.",
    submittedDate: "2023-05-18",
    status: "pending",
    votes: 0,
  },
  {
    id: "app4",
    title: "Neighborhood Art Installation",
    organization: "Urban Arts Collective",
    contact: "David Rodriguez",
    requestedAmount: 6800,
    description:
      "Creating public art installations in underserved neighborhoods to promote cultural expression and community pride.",
    submittedDate: "2023-05-05",
    status: "approved",
    votes: 32,
  },
  {
    id: "app5",
    title: "Mental Health Support Group",
    organization: "Wellness Alliance",
    contact: "Amanda Lee",
    requestedAmount: 3500,
    description:
      "Establishing support groups for individuals dealing with mental health challenges, with a focus on underserved communities.",
    submittedDate: "2023-05-20",
    status: "pending",
    votes: 0,
  },
  {
    id: "app6",
    title: "Sustainable Energy Workshop",
    organization: "EcoFuture",
    contact: "James Wilson",
    requestedAmount: 5500,
    description:
      "Educational workshops on sustainable energy practices for residential communities to reduce carbon footprint.",
    submittedDate: "2023-05-08",
    status: "rejected",
    votes: 0,
    rejectionReason: "Project scope outside of current funding priorities.",
  },
];

export function PoolApplications({ pool }: PoolApplicationsProps) {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [localApplications, setLocalApplications] = useState(applications);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingApplications = localApplications.filter(
    (app) => app.status === "pending"
  );
  const approvedApplications = localApplications.filter(
    (app) => app.status === "approved"
  );
  const rejectedApplications = localApplications.filter(
    (app) => app.status === "rejected"
  );

  // Filter applications based on search query
  const filteredPendingApplications = pendingApplications.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApprovedApplications = approvedApplications.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRejectedApplications = rejectedApplications.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = () => {
    if (!selectedApplication) return;

    setLocalApplications((apps) =>
      apps.map((app) =>
        app.id === selectedApplication.id
          ? { ...app, status: "approved", reviewComment }
          : app
      )
    );
    setReviewDialogOpen(false);
    setReviewComment("");
  };

  const handleReject = () => {
    if (!selectedApplication) return;

    setLocalApplications((apps) =>
      apps.map((app) =>
        app.id === selectedApplication.id
          ? { ...app, status: "rejected", rejectionReason: reviewComment }
          : app
      )
    );
    setReviewDialogOpen(false);
    setReviewComment("");
  };

  const openReviewDialog = (application: any) => {
    setSelectedApplication(application);
    setReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Project Applications</CardTitle>
              <CardDescription>
                Review and manage applications for funding
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>
                  Total: {pool.applicationsCount || localApplications.length}
                </span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  Pending:{" "}
                  {pool.pendingApplications || pendingApplications.length}
                </span>
              </Badge>
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>
                  Approved:{" "}
                  {pool.approvedApplications || approvedApplications.length}
                </span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="pending" className="space-y-4">
              {filteredPendingApplications.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      No pending applications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All applications have been reviewed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Project</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.title}
                          </TableCell>
                          <TableCell>{application.organization}</TableCell>
                          <TableCell className="text-right">
                            ${application.requestedAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(
                              application.submittedDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => openReviewDialog(application)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {filteredApprovedApplications.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      No approved applications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Approved applications will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Project</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Votes</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApprovedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.title}
                          </TableCell>
                          <TableCell>{application.organization}</TableCell>
                          <TableCell className="text-right">
                            ${application.requestedAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {application.votes}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="default">Approved</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {filteredRejectedApplications.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      No rejected applications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Rejected applications will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Project</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRejectedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.title}
                          </TableCell>
                          <TableCell>{application.organization}</TableCell>
                          <TableCell className="text-right">
                            ${application.requestedAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {application.rejectionReason}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="destructive">Rejected</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review the application details and provide your feedback.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {selectedApplication.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Submitted by {selectedApplication.organization} on{" "}
                  {new Date(
                    selectedApplication.submittedDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Requested Amount</h4>
                <p>${selectedApplication.requestedAmount.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Project Description</h4>
                <p className="text-sm">{selectedApplication.description}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment">Review Comments</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Enter your review comments here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button variant="destructive" onClick={handleReject}>
              <ThumbsDown className="mr-2 h-4 w-4" />
              Reject Application
            </Button>
            <Button onClick={handleApprove}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
