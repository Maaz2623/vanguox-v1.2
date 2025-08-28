"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ImageIcon,
  GlobeIcon,
  MailIcon,
  CodeIcon,
  MessageCircleIcon,
  CrownIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // ✅ import scroll area

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const plans = [
  {
    name: "Free",
    price: "₹0 / month",
    description: "For personal and light use.",
    features: [
      { label: "Basic AI chat", icon: MessageCircleIcon },
      { label: "Community support", icon: GlobeIcon },
      { label: "Limited tokens (5,000 / month)", icon: CrownIcon },
    ],
  },
  {
    name: "Pro",
    price: "₹499 / month",
    description: "Unlock all AI tools and higher limits.",
    highlight: true,
    features: [
      { label: "AI chat (priority speed)", icon: MessageCircleIcon },
      { label: "Image generation", icon: ImageIcon },
      { label: "Web search integration", icon: GlobeIcon },
      { label: "Email sending", icon: MailIcon },
      { label: "App builder (v0 integration)", icon: CodeIcon },
      { label: "10,000 tokens / month", icon: CrownIcon },
    ],
  },
];

export const PlansDialog = ({ open, setOpen }: Props) => {
  const isMobile = useIsMobile();

  const PlansContent = () => (
    <div className="grid gap-6 sm:grid-cols-2 pb-40">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`rounded-2xl shadow-md transition hover:shadow-lg ${
            plan.highlight ? "border-primary border-2" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {plan.highlight && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary text-white">
                  Recommended
                </span>
              )}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{plan.price}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <f.icon className="h-4 w-4 text-primary" />
                  {f.label}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={plan.name === "Free"}>
              {plan.name === "Free"
                ? "Current Plan"
                : `Upgrade to ${plan.name}`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      {!isMobile ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl! max-h-[80vh]!">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Choose Your Plan
              </DialogTitle>
              <DialogDescription>
                Unlock AI-powered features like Image Generation, Web Search,
                App Builder, and more.
              </DialogDescription>
            </DialogHeader>
            <PlansContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-screen!">
            <ScrollArea className="h-[85vh] p-4">
              <DrawerHeader>
                <DrawerTitle className="text-lg font-bold">
                  Choose Your Plan
                </DrawerTitle>
                <DrawerDescription>
                  Unlock AI-powered features like Image Generation, Web Search,
                  App Builder, and more.
                </DrawerDescription>
              </DrawerHeader>

              {/* ✅ Make mobile drawer scrollable */}
              <PlansContent />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
