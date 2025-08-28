"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { GaugeIcon, SettingsIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ChatViewNavSecondary({
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const router = useRouter();

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.usage.getUsage.queryOptions(undefined, {
      refetchInterval: 5000,
    })
  );

  const maxTokens = 50000;

  const usedTokens = data?.totalTokens ?? 0;
  const progressValue = Math.min((usedTokens / maxTokens) * 100, 100);

  const { open } = useSidebar();

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="">
              {!open ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      onClick={() => router.push(`/settings`)}
                      className={cn(
                        "",
                        pathname === "/settings" &&
                          "dark:bg-neutral-800 bg-neutral-200 font-semibold"
                      )}
                    >
                      <span className="">
                        <GaugeIcon />
                        Usage
                      </span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-background!">
                    <div className="h-20 text-foreground rounded-lg w-full border overflow-hidden px-2">
                      <div className="h-[80%] items-end flex flex-col justify-start">
                        <h2 className="w-full text-lg font-semibold mt-2">
                          Free Plan
                        </h2>
                        <p className="mt-auto mb-1 w-full">
                          {formatNumber(data?.totalTokens ?? 0)} /{" "}
                          {formatNumber(maxTokens)} tokens used
                        </p>
                      </div>
                      <div className="h-[20%]">
                        <Progress value={progressValue} />
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="h-20 rounded-lg w-full border overflow-hidden px-2">
                  <div className="h-[80%] items-end flex flex-col justify-start">
                    <h2 className="w-full text-xl font-semibold mt-2">
                      Free Plan
                    </h2>
                    <p className="mt-auto mb-1 w-full">
                      {formatNumber(data?.totalTokens ?? 0)} /{" "}
                      {formatNumber(maxTokens)} tokens used
                    </p>
                  </div>
                  <div className="h-[20%]">
                    <Progress value={progressValue} />
                  </div>
                </div>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem className="">
              <SidebarMenuButton
                asChild
                onClick={() => router.push(`/settings`)}
                className={cn(
                  "",
                  pathname === "/settings" &&
                    "dark:bg-neutral-800 bg-neutral-200 font-semibold"
                )}
              >
                <span className="">
                  <SettingsIcon />
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
