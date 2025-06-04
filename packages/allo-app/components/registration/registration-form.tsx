"use client";
import { type z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Address } from "viem/accounts";
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
import { BalanceCheck } from "~/components/token/balance-check";
import { ImageUpload } from "~/components/image-upload";
import { RegistrationSchema } from "./schemas";
import { useRegister } from "./use-register";
import { ImportProject } from "./import-project";

export function RegistrationForm({
  strategyAddress,
  defaultValues,
  onSuccess,
}: {
  strategyAddress: Address;
  defaultValues?: Partial<z.infer<typeof RegistrationSchema>>;
  onSuccess?(value: { project: string }): void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues,
  });

  const register = useRegister({ strategyAddress });
  const upload = useIpfsUpload();

  const isLoading = upload.isPending || register.isPending;
  console.log(form.formState);
  return (
    <Form {...form}>
      <form
        className="relative space-y-2 mx-auto max-w-(--breakpoint-sm)"
        onSubmit={form.handleSubmit(async (values) => {
          const { cid: metadata } = await upload.mutateAsync(values.metadata);
          register
            .mutateAsync([values.address, metadata, "0x"])
            .then(onSuccess);
        })}
      >
        {/* <div className="flex justify-center">
          <ImportProject
            onSelect={(project) => {
              console.log("project", project);
              form.setValue("metadata.title", project.name);
              form.setValue("metadata.description", project.description);
              form.setValue("metadata.image", project.bannerImg);
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-full h-px bg-gray-200" />
          <span className="text-sm text-gray-500">or</span>
          <div className="w-full h-px bg-gray-200" />
        </div> */}
        <FormField
          control={form.control}
          name="metadata.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grant name</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Grant #1" {...field} />
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout address</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="0x..." {...field} />
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
                <Textarea rows={8} placeholder={"..."} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Markdown is supported</FormDescription>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <BalanceCheck>
            <Button isLoading={isLoading} type="submit">
              Create Project
            </Button>
          </BalanceCheck>
        </div>
      </form>
    </Form>
  );
}
