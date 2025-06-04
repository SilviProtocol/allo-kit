import { Badge } from "../ui/badge";

export function ApprovedBadge({
  isApproved,
  className,
}: {
  isApproved?: boolean;
  className?: string;
}) {
  return typeof isApproved === "undefined" ? null : (
    <Badge variant={isApproved ? "success" : "secondary"} className={className}>
      {isApproved ? "Approved" : "Pending"}
    </Badge>
  );
}
