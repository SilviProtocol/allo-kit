import { Address } from "viem";
import { useAccount } from "wagmi";
import { useDebounce } from "react-use";
import { useGSProjects } from "~/hooks/use-gs-projects";
import { useState } from "react";
import * as chains from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EnsName } from "../ens";
import { useRegistrations } from "./use-register";

export function ImportProject({
  onSelect,
}: {
  onSelect: (project: any) => void;
}) {
  const { address, isConnecting } = useAccount();
  const [open, openChange] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, refetch, isRefetching, isPending } = useRegistrations({
    where: {
      owner_in: [address!],
    },
  });

  useDebounce(
    () => {
      setSearchQuery(value);
    },
    500,
    [value]
  );

  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    "0x5a1f55459c07432165A93Eac188076d2ECBF6814"
  );

  console.log(data);

  return (
    <div>
      <Dialog open={open} onOpenChange={openChange}>
        <DialogTrigger asChild>
          <Button>Import Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Import a previously registered application.
          </DialogDescription>
          <Command>
            <Command className="rounded-lg border shadow-md md:min-w-[450px] md:min-h-[400px]">
              <CommandInput
                value={value}
                onValueChange={setValue}
                placeholder="Enter address of creator..."
              />
              {isPending ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : data?.items?.length ? (
                <CommandList>
                  {data.items.map((project) => (
                    <CommandItem
                      className="cursor-pointer"
                      onSelect={() => {
                        onSelect(project);
                        openChange(false);
                      }}
                      forceMount
                      key={`${project.id}-${project.chainId}`}
                    >
                      <Avatar>
                        <AvatarImage src={project.metadata.image} />
                        <AvatarFallback>
                          <div className="bg-gray-200 rounded-full" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="truncate">{project.metadata.title}</div>
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">
                            {project.chainId}
                          </span>
                          <span className="text-xs text-gray-500">
                            <EnsName address={project.address} />
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </Command>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
  //   return <SelectProject onSelect={onSelect} />;
  //   return (
  //     <Dialog>
  //       <DialogTrigger>
  //         <Button variant={"secondary"}>Import Project</Button>
  //       </DialogTrigger>
  //       <DialogContent className="max-w-(--breakpoint-sm)">
  //   <DialogHeader>
  //     <DialogTitle>Import Project</DialogTitle>
  //   </DialogHeader>
  //       </DialogContent>
  //     </Dialog>
  //   );
}
