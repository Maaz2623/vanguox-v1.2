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
import { ScrollArea } from "@/components/ui/scroll-area";
import Script from "next/script";

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

  // 🔹 Razorpay Checkout
  const handleRazorpayPayment = async () => {
    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 499, currency: "INR" }),
    });

    const order = await orderRes.json(); // contains order.id
    setOpen(false);

    const options: any = {
      key: "rzp_test_RAq9fAUQXhGvuG",
      amount: order.amount, // from backend
      currency: order.currency,
      name: "Vanguox",
      description: "Pro Plan Subscription",
      order_id: order.id, // ✅ required for signature verification
      handler: async function (response: any) {
        // This object now has all 3 fields
        const data = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };

        // Send to backend for verification
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await verifyRes.json();
        console.log("Verification result:", result);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "918296472301",
      },
      theme: {
        color: "#4F46E5",
      },
    };

    console.log(options);

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

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
            {plan.name === "Pro" ? (
              <Button
                className="w-full"
                type="button"
                onClick={handleRazorpayPayment}
              >
                Upgrade to Pro
              </Button>
            ) : (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

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

              {/* ✅ Scrollable Drawer */}
              <PlansContent />
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
