"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Google from "@/assets/google.svg"
import Apple from "@/assets/apple.svg"
import Microsoft from "@/assets/microsoft.svg"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/")
      } else {
        console.log(result)
        setError("Login incomplete. Please check console for details.")
      }
    } catch (err: any) {
      console.error("error", err.errors[0]?.longMessage)
      setError(err.errors[0]?.longMessage || "Something went wrong")
    }
  }

  const handleOAuth = async (strategy: "oauth_google" | "oauth_apple" | "oauth_microsoft") => {
    if (!isLoaded || !signIn) return
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/user/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" type="button" onClick={() => handleOAuth("oauth_apple")}>
                  <Apple/>
                  Login with Apple
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuth("oauth_google")}>
                  <Google/>
                  Login with Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuth("oauth_microsoft")}>
                  <Microsoft/>
                  Login with Microsoft
                </Button>
              </div>
              <div className="relative text-center text-sm py-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative bg-popover z-10 px-4  text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={email ? `/user/forgot-password?email=${encodeURIComponent(email)}` : "/user/forgot-password"}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
              <div className="text-center text-sm">
                Don&apos;t have an account? <Link href="/user/sign-up" className="underline underline-offset-4">Sign up</Link>
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
  )
}
