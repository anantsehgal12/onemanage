"use client"

import * as React from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"

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
import { cn } from "@/lib/utils"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isLoaded, signIn } = useSignIn()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = React.useState(searchParams.get("email") || "")
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      setSuccess(true)
      setError("")
      router.push("/user/reset-password")
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors[0]?.message || "Something went wrong")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to get a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={success}>
                Send Reset Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}