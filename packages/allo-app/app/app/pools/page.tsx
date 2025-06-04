import Link from "next/link";
import { Page } from "~/components/page";
import { PoolList } from "~/components/pool/pool-list";

export default function PoolsPage() {
  return (
    <Page title="Explore Pools" description="Browse and discover funding pools">
      <div className="w-full flex-1">
        <PoolList query={{}} />
      </div>
    </Page>
  );
}

function PoolCardSkeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50 hover:bg-muted" />;
}
