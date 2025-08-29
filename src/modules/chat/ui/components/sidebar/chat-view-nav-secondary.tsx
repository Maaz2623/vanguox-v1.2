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
import { CrownIcon, GaugeIcon, SettingsIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PlansDialog } from "@/modules/subscription/ui/components/plans-dialog";

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

  const { data: maxTokens } = useQuery(
    trpc.usage.getMaxTokens.queryOptions(undefined, {
      refetchInterval: 5000,
    })
  );

  const { open } = useSidebar();

  const [plansDialogOpen, setPlansDialogOpen] = React.useState(false);

  if (!maxTokens) return;

  const usedTokens = data ?? 0;
  const progressValue = Math.min((usedTokens / maxTokens) * 100, 100);

  return (
    <>
      <PlansDialog open={plansDialogOpen} setOpen={setPlansDialogOpen} />
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="mb-2">
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
                    <div className="w-full rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">
                          Free
                        </h2>
                        <Button
                          size="sm"
                          className="rounded-full"
                          variant="outline"
                          onClick={() => setPlansDialogOpen(true)}
                        >
                          <CrownIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Usage Info */}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(data ?? 0)} / {formatNumber(maxTokens)}{" "}
                          tokens used
                        </p>
                        <Progress
                          value={progressValue}
                          className="h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-full rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Free
                    </h2>
                    <Button
                      size="sm"
                      className="rounded-full"
                      variant="outline"
                      onClick={() => setPlansDialogOpen(true)}
                    >
                      <CrownIcon className="h-4 w-4" />
                      Upgrade
                    </Button>
                  </div>

                  {/* Usage Info */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(data ?? 0)} / {formatNumber(maxTokens)}{" "}
                      tokens used
                    </p>
                    <Progress
                      value={progressValue}
                      className="h-2 rounded-full"
                    />
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
