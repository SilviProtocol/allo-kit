"use client";

import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { ConnectButton } from "~/components/connect-button";
import { FaucetButton } from "~/components/faucet-button";
import { Logo } from "~/components/logo";
import { NavLink } from "~/components/nav-link";
import { Input } from "~/components/ui/input";

export function Header() {
  const params = useParams();

  console.log(params);
  const poolAddress = params.poolAddress as string;
  return (
    <div className="border-b">
      <header className="max-w-screen-xl mx-auto flex items-center p-2">
        <Logo href="/" />
        <div className="ml-16 flex items-center flex-1">
          {poolAddress ? (
            <>
              <NavLink href={`/app/pools/${poolAddress}`}>Projects</NavLink>
              <NavLink href={`/app/pools/${poolAddress}/checkout`}>
                Checkout
              </NavLink>
            </>
          ) : null}
          {/* <NavLink href="/app/strategies">Strategies</NavLink> */}
        </div>
        <div className="flex items-center gap-1 ">
          <Input type="search" placeholder="Search..." className="" />
          {/* 
        <ConnectButton />
        <FaucetButton /> */}
          {/* 
          <div>
            <Link href="/app/checkout" prefetch>
              <Button icon={ShoppingBag} variant={"ghost"} size="icon" />
            </Link>
          </div> */}
          {/* <NetworkSelector /> */}
          <NavLink href="/app/profile">Profile</NavLink>
          <ConnectButton />
          <FaucetButton />
        </div>
      </header>
    </div>
  );
}
