import { Address, formatUnits } from "viem";
import { useToken } from "~/components/token/use-token";
import { formatNumber } from "~/lib/format";

export function TokenAmount({
  amount = 0,
  token,
  hideSymbol = false,
}: {
  amount: number | bigint;
  token: Address;
  hideSymbol?: boolean;
}) {
  const { data } = useToken(token);

  if (!data) return null;
  const formattedAmount = formatTokenAmount(amount, data.decimals);

  return <>{`${formattedAmount} ${hideSymbol ? "" : data?.symbol}`}</>;
}

export function TokenSymbol({ token }: { token: Address }) {
  const { data } = useToken(token);

  if (!data) return null;

  return <>{data?.symbol}</>;
}

export function formatTokenAmount(amount: number | bigint, decimals: number) {
  return formatNumber(Number(formatUnits(BigInt(amount ?? 0), decimals)));
}
