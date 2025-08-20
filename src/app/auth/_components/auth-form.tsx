"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export const AuthForm = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
  });

  const handleGoogleLogin = () => {
    authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
      }
    );
  };

  const handleGithubLogin = () => {
    authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const isDisabled =
    !formData.email ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.password ||
    !formData.terms;

  return (
    <div className="min-h-screen md:h-screen flex justify-center items-center relative px-4 py-4">
      {/* Blurred Background Overlay */}
      <div className="absolute top-0 left-0 bg-transparent w-full h-full -z-5 backdrop-blur-sm" />
      <Image
        src="/bg.jpg"
        alt="background"
        fill
        className="object-cover -z-10 bg-black/70"
      />

      {/* Card */}
      <fieldset disabled={loading}>
        <div className="w-full max-w-5xl h-full shadow-2xl rounded-xl bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Left Side Image (hidden on small screens) */}
          <div className="md:w-1/2 hidden md:flex justify-center items-center p-4">
            <Image
              src={`/ai-image.jpg`}
              alt="logo"
              width={500}
              height={500}
              className="w-full h-full rounded-xl object-cover"
            />
          </div>

          {/* Right Side Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start px-6 md:px-12 py-8 md:py-12 space-y-4 w-full md:w-1/2"
          >
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-start">
                Create an account
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-start">
                Get started with creating your account.
              </p>
            </div>

            <div className="w-full my-4 space-y-4">
              {/* Name Fields */}
              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="w-full space-y-1">
                  <Label className="text-xs sm:text-sm">First Name</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border text-sm sm:text-base"
                    placeholder="e.g. John"
                  />
                </div>
                <div className="w-full space-y-1">
                  <Label className="text-xs sm:text-sm">Last Name</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="text-sm sm:text-base"
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-sm sm:text-base"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Password</Label>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="text-sm sm:text-base"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-x-2 text-xs sm:text-sm">
                <Checkbox
                  checked={formData.terms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      terms: checked === true,
                    }))
                  }
                  className="size-4 border"
                />

                <p>
                  I agree to the{" "}
                  <a
                    href="/terms-conditions"
                    className="underline text-blue-700"
                  >
                    Terms & Conditions
                  </a>
                </p>
              </div>

              {/* Create Account Button */}
              <div>
                <Button
                  disabled={isDisabled}
                  type="submit"
                  className="w-full text-sm sm:text-base"
                  size="lg"
                >
                  Create Account
                </Button>
              </div>

              {/* Divider */}
              <div className="after:border-border relative text-center text-xs sm:text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Social Login */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="w-full sm:w-1/2 text-sm sm:text-base"
                  variant="outline"
                  size="lg"
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="mr-2" /> Google
                </Button>
                <Button
                  className="w-full sm:w-1/2 text-sm sm:text-base"
                  variant="outline"
                  size="lg"
                  disabled
                  onClick={handleGithubLogin}
                >
                  <FaGithub className="mr-2" /> Github
                </Button>
              </div>
            </div>

            {/* Already have account */}
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-700 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </fieldset>
    </div>
  );
};
