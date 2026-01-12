"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/app/_components/login-form"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function LoginPage() {

  const {isSignedIn} = useUser()

  if(isSignedIn)(
    redirect("/dashboard")
  )

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          OneManage
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
