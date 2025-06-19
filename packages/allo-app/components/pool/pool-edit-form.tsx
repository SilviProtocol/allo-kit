"use client";
import { type z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { BalanceCheck } from "~/components/token/balance-check";
import { useConfigurePool } from "./use-pool";
import { useToken } from "../token/use-token";
import { Address } from "viem";

type Token = {
  symbol: string;
  address?: string;
  decimals: number;
};
export function PoolEditForm({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: Partial<z.infer<typeof PoolSchema>>;
  onSuccess?(value: { poolAddress: string }): void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof PoolSchema>>({
    resolver: zodResolver(PoolSchema),
    defaultValues,
  });

  const configure = useConfigurePool();
  const upload = useIpfsUpload();
  const isLoading = upload.isPending || configure.isPending;

  const allocationToken = useToken(defaultValues?.allocationToken);
  console.log(allocationToken);
  console.log(defaultValues);

  console.log(form.formState.errors);
  return (
    <Form {...form}>
      <form
        className="relative space-y-2 mx-auto w-full max-w-(--breakpoint-sm)"
        onSubmit={form.handleSubmit(async ({ metadata, ...values }) => {
          if (!allocationToken) throw new Error("Allocation token not found");
          console.log(values);
          // const metadataURI = ""; // Quick debug
          const { cid: metadataURI } = await upload.mutateAsync(metadata);

          configure
            .mutateAsync([
              defaultValues?.address as Address,
              {
                ...defaultValues,
                metadataURI,
              },
            ])
            .then(({ pool }) => {
              router.push(`/dashboard/${pool}`);
            });
          return;
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
        <div className="flex items-center justify-end">
          <BalanceCheck>
            <Button isLoading={isLoading} type="submit">
              Update Pool
            </Button>
          </BalanceCheck>
        </div>
      </form>
    </Form>
  );
}
