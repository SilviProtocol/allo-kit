"use client";
import { type z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useIpfsUpload } from "~/hooks/use-ipfs-upload";
import { ImageUpload } from "~/components/image-upload";
import { PoolSchema } from "./schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Strategy } from "~/schemas";
import { BalanceCheck } from "~/components/token/balance-check";
import { useCreatePool } from "./use-pool";
import { parseUnits } from "viem";
import { createElement } from "react";
import { PlusIcon } from "lucide-react";

type Token = {
  symbol: string;
  address?: string;
  decimals: number;
};
export function PoolForm({
  strategies,
  tokens,
  defaultValues,
  onSuccess,
}: {
  strategies: Strategy[];
  tokens: Token[];
  defaultValues?: Partial<z.infer<typeof PoolSchema>>;
  onSuccess?(value: { poolAddress: string }): void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof PoolSchema>>({
    resolver: zodResolver(PoolSchema),
    defaultValues,
  });

  const create = useCreatePool();
  const upload = useIpfsUpload();
  const isLoading = upload.isPending || create.isPending;

  const selectedStrategy = strategies.find(
    (s) => s.address === form.watch("strategy")
  )?.name;
  return (
    <Form {...form}>
      <form
        className="relative space-y-2 mx-auto w-full max-w-(--breakpoint-sm)"
        onSubmit={form.handleSubmit(async ({ metadata, ...values }) => {
          console.log(values);
          // const metadataURI = ""; // Quick debug
          const { cid: metadataURI } = await upload.mutateAsync(metadata);
          const strategy = strategies.find(
            (s) => s.address === values.strategy
          );
          if (!strategy) throw new Error("Strategy not found");

          console.log("strategy", strategy);

          const allocationToken = tokens.find(
            (t) => t.address === values.allocationToken
          );
          if (!allocationToken) throw new Error("Allocation token not found");

          create
            .mutateAsync([
              strategy.address,
              {
                ...values,
                metadataURI,
                maxAmount: parseUnits(
                  String(values.maxAmount),
                  allocationToken.decimals
                ),
                timestamps: [],
              },
              "0x",
            ])
            .then(({ pool }) => {
              console.log("created pool", pool);
              router.push(`/dashboard/${pool}`);
            });
          return;

          /*
          function encodeSimpleGrants(schema: string) {
            const voteToken = tokens.find(
              (t) => t.address === values.strategyData.voteToken
            );
            const matchToken = tokens.find(
              (t) => t.address === values.strategyData.matchToken
            );
            if (!voteToken || !matchToken) throw new Error("Token not found");
            return encodeData(schema, [
              values.strategyData.voteToken,
              values.strategyData.matchToken,
              parseUnits(values.strategyData.poolCap, matchToken.decimals),
            ]);
          }
          function encodeQuadraticFunding(schema: string) {
            return encodeData(schema, [
              values.strategyData.donationToken,
              values.strategyData.matchingToken,
            ]);
          }
          const data =
            selectedStrategy === "SimpleGrants"
              ? encodeSimpleGrants(strategy.schema)
              : encodeQuadraticFunding(strategy.schema);

          */
        })}
      >
        <FormField
          control={form.control}
          name="metadata.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pool name</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Pool name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload {...field} upload={upload} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder={"..."} {...field} className="h-48" />
              </FormControl>
              <FormMessage />
              <FormDescription></FormDescription>
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Owner address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="allocationToken"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Vote Token</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distributionToken"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Match Token</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="maxAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pool Max Amount</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="0" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.address} value={strategy.address}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {selectedStrategy &&
          createElement(
            strategyComponents[
              selectedStrategy as keyof typeof strategyComponents
            ],
            { tokens }
          )}

        <div className="flex items-center justify-end">
          <BalanceCheck>
            <Button isLoading={isLoading} type="submit">
              Create Pool
            </Button>
          </BalanceCheck>
        </div>
      </form>
    </Form>
  );
}

const strategyComponents = {
  RetroFunding: RetroFundingForm,
  QuadraticFunding: QuadraticFundingForm,
};
function RetroFundingForm({ tokens }: { tokens: Token[] }) {
  const form = useFormContext();
  return (
    <>
      <pre>Additional RetroFunding data</pre>
    </>
  );
}

function QuadraticFundingForm({ tokens }: { tokens: Token[] }) {
  const form = useFormContext();
  return (
    <div className="grid grid-cols-2 gap-2">
      <pre>Additional QuadraticFunding data</pre>
    </div>
  );
}
