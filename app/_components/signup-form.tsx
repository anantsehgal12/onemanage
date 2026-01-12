"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Google from "@/assets/google.svg"
import Apple from "@/assets/apple.svg"
import Microsoft from "@/assets/microsoft.svg"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    if (!pendingVerification) {
      try {
        await signUp.create({
          emailAddress: email,
          password,
        });
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setPendingVerification(true);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        setError(err.errors[0]?.message || "Something went wrong");
      }
    } else {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });
        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push("/");
        } else {
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        setError(err.errors[0]?.message || "Invalid code");
      }
    }
  };

  const handleOAuth = async (
    strategy: "oauth_google" | "oauth_apple" | "oauth_microsoft"
  ) => {
    if (!isLoaded || !signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/user/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {!pendingVerification && (
                <>
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleOAuth("oauth_apple")}
                    >
                      <Apple/>
                      Sign up with Apple
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleOAuth("oauth_google")}
                    >
                      <Google/>
                      Sign up with Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleOAuth("oauth_microsoft")}
                    >
                      <Microsoft/>
                      Sign up with Microsoft
                    </Button>
                  </div>
                  <div className="relative text-center text-sm py-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative bg-popover z-10 px-4  text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div id="clerk-captcha"></div>
                </>
              )}
              {pendingVerification && (
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                {pendingVerification ? "Verify Email" : "Sign Up"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/user/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
