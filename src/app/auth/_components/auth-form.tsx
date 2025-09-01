"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";

export const AuthForm = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    authClient.signIn.social(
      { provider: "google" },
      { onRequest: () => setLoading(true) }
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative px-4 py-6">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md -z-10" />
      <Image
        src="/bg.jpg"
        alt="background"
        fill
        className="object-cover -z-20"
      />

      {/* Card */}
      <fieldset disabled={loading} className="w-full max-w-md">
        <div className="w-full rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-xl p-8 space-y-6 text-center">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with your Google account
            </p>
          </div>

          {/* Google Sign-In */}
          <Button
            className="w-full text-sm"
            variant="outline"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <FaGoogle className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative flex items-center">
            <span className="flex-grow border-t border-border" />
            <span className="mx-3 text-xs text-muted-foreground">OR</span>
            <span className="flex-grow border-t border-border" />
          </div>

          {/* Login Link */}
          <p className="text-xs sm:text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </div>
      </fieldset>
    </div>
  );
};
