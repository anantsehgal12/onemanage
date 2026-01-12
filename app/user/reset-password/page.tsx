"use client"
import { ResetPasswordForm } from "@/app/_components/reset-password-form"
import { useUser } from "@clerk/nextjs"
import { GalleryVerticalEnd } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  
  const {isSignedIn} = useUser()

  if(isSignedIn)(
    redirect("/dashboard")
  )
    return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          OneManage
        </a>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}