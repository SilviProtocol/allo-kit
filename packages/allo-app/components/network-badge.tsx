import { Badge } from "./ui/badge";
import { chainIdToNetwork } from "~/hooks/use-current-chain";

export function NetworkBadge({ chainId }: { chainId?: number }) {
  if (!chainId) return null;
  const network = chainIdToNetwork(chainId);

  return <Badge variant="outline">{network?.name}</Badge>;
}
