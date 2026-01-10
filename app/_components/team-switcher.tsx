"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { CreateOrganization, useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function TeamSwitcher() {

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useUser()
  const User = user.user

  const { isMobile } = useSidebar()
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const { organization } = useOrganization()
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)

  React.useEffect(() => {
    if (showNewTeamDialog && searchParams?.get("newOrg")) {
      setShowNewTeamDialog(false)
      const url = new URL(window.location.href)
      url.searchParams.delete("newOrg")
      router.replace(url.pathname + url.search)
    }
  }, [showNewTeamDialog, searchParams, router])

  const teams = React.useMemo(
    () =>
      userMemberships.data?.map((mem) => ({
        name: mem.organization.name,
        logo: ({ className }: { className?: string }) => (
          <img className={className} src={mem.organization.imageUrl} alt={mem.organization.name} />
        ),
        plan: "Enterprise",
        id: mem.organization.id,
      })) || [],
    [userMemberships.data]
  )

  const activeTeam = React.useMemo(
    () => teams.find((t) => t.id === organization?.id) || teams[0],
    [teams, organization]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        const match = e.code.match(/^Digit([1-9])$/)
        if (match) {
          e.preventDefault()
          const index = parseInt(match[1]) - 1
          if (teams[index] && setActive) {
            setActive({ organization: teams[index].id })
            setOpen(false)
          }
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [teams, setActive])

  if (!isLoaded) {
    return null
  }

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-7 rounded-md" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs">{User?.fullName}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) w-100 rounded-lg p-0"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <Command>
              <CommandInput placeholder="Search team..." />
              <CommandList>
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup heading="Teams">
                  {teams.map((team, index) => (
                    <CommandItem
                      key={team.name}
                      onSelect={() => {
                        setActive && setActive({ organization: team.id })
                        setOpen(false)
                      }}
                      className="gap-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <team.logo className="size-5.5 rounded-md shrink-0" />
                      </div>
                      {team.name}
                      <span className="text-muted-foreground ml-auto text-xs tracking-widest">CTRL + SHIFT + {index + 1}</span>
                      <DropdownMenuShortcut className="hidden">⌃⇧{index + 1}</DropdownMenuShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                    className="gap-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">Add team</div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px] shadow-none">
            <DialogHeader className="hidden">
              <DialogTitle>Create Organization</DialogTitle>
            </DialogHeader>
            <CreateOrganization
              afterCreateOrganizationUrl={() => {
                const url = new URL(window.location.href)
                url.searchParams.set("newOrg", "true")
                return url.toString()
              }}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
