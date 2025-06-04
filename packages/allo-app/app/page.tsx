import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Coins, Rocket } from "lucide-react";
import { PoolFilter } from "./dashboard/[poolAddress]/pools/_components/pool-filter";

export default function Home() {
  return (
    <main className="pt-8 max-w-screen-xl mx-auto">
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-20 px-6">
        <div className="md:mt-6 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
              Allo Grants
            </h1>
            <p className="mt-6 max-w-[60ch] xs:text-lg text-xl">
              Trusted infrastructure for programmable capital flows.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
              <Link prefetch href="/app">
                <Button
                  size="lg"
                  iconRight={Rocket}
                  className="w-full sm:w-auto rounded-full text-base"
                >
                  Grantees
                </Button>
              </Link>
              <Link prefetch href="/dashboard">
                <Button
                  variant="outline"
                  icon={Coins}
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base shadow-none"
                >
                  Funders
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full flex-1 pt-24">
          <h1 className="text-2xl font-bold text-center mb-2">
            Featured Pools
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <Link href="/app/pools/1" key={index}>
                <PoolCardSkeleton key={index} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function PoolCardSkeleton() {
  return <div className="aspect-video rounded-xl bg-muted/50 hover:bg-muted" />;
}
