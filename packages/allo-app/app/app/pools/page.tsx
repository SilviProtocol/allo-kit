"use client";

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
