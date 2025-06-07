import { Badge } from "../ui/badge";

const VARIANT_MAP = {
  approved: "success",
  rejected: "secondary",
  pending: "secondary",
} as const;

const LABEL_MAP = {
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
} as const;

export function ApprovedBadge({
  status,
  className,
}: {
  status?: "approved" | "rejected" | "pending";
  className?: string;
}) {
  if (!status) return null;

  const variant = VARIANT_MAP[status] ?? "secondary";
  const label = LABEL_MAP[status] ?? "Pending";

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
