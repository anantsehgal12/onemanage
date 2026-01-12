'use client'

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function Page(){
  
  const {isSignedIn} = useUser()

  if(isSignedIn)(
    redirect("/dashboard")
  )

  if(!isSignedIn)(
    redirect("/user/login")
  )

};
