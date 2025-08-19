import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const AuthPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="h-[85%] shadow-2xl w-[70%] border rounded-lg border-green-500 flex">
        <div className="w-1/2 flex justify-center items-center p-4">
          <Image
            src={`/ai-image.jpg`}
            alt="logo"
            width={500}
            height={500}
            className="w-full h-full rounded-xl"
          />
        </div>
        <div className="flex flex-col items-start text-center w-1/2 border px-16 py-20 space-y-4">
          <div className="border w-full">
            <div className="text-start">
              <h1 className="text-3xl w-full text-start font-semibold">
                Create an account
              </h1>
              <p className="text-muted-foreground">
                Get started with creating your account.
              </p>
            </div>
          </div>
          <div className="w-full my-4 space-y-4">
            <div className="flex w-full gap-x-4 border">
              <div className="w-full space-y-1">
                <Label>First Name</Label>
                <Input className="" placeholder="e.g. John" />
              </div>
              <div className="w-full space-y-1">
                <Label>Last Name</Label>
                <Input className="" placeholder="e.g. Doe" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input placeholder="Enter your email" type="email" />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input placeholder="Enter your password" type="password" />
            </div>
            <div className="flex items-center gap-x-2 text-sm">
              <Checkbox className="size-4" />
              <p>
                I agree to the{" "}
                <a href="/terms-conditions" className="underline text-blue-700">
                  Terms & Conditions
                </a>
              </p>
            </div>
            <div>
              <Button className="w-full" size={`lg`}>
                Create Account
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div className="flex gap-x-3">
              <Button className="w-1/2" variant={`outline`} size={`lg`}>
                Google
              </Button>
              <Button className="w-1/2" variant={`outline`} size={`lg`}>
                Github
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
