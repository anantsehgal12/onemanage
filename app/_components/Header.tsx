import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function Header() {
  return (
          <header className="flex h-16 items-center gap-2">
            <div className="flex items-center gap-5 px-10">
              <SidebarTrigger />
              <h1 className="font-bold text-lg">OneManage</h1>
            </div>
          </header>
  )
}

export default Header