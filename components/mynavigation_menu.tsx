"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { cn } from "@/lib/utils"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "https://ui.shadcn.com/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "https://ui.shadcn.com/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "https://ui.shadcn.com/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "https://ui.shadcn.com/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "https://ui.shadcn.com/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "https://ui.shadcn.com/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

/**
 * Renders a multi-section navigation menu with "Getting started", "Components", and "Documentation" panels.
 *
 * The "Getting started" panel includes a featured card and quick links; the "Components" panel renders a list of component entries. Navigation items are built using the NavigationMenu primitives and the ListItem subcomponent.
 *
 * @returns A JSX element representing the navigation menu.
 */
export default function NavigationMenuDemo() {
  return (
    <NavigationMenu className="z-5 ">
      <NavigationMenuList>
        <NavigationMenuItem className="sm:block hidden">
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-3 p-2 lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-base p-6 no-underline outline-hidden"
                    href="https://ui.shadcn.com"
                  >
                    <div className="mb-2 mt-4 text-lg font-heading">
                      shadcn/ui
                    </div>
                    <p className="text-sm font-base leading-tight">
                      Beautifully designed components that you can copy and
                      paste into your apps. Accessible. Customizable. Open
                      Source.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://ui.shadcn.com/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem
                href="https://ui.shadcn.com/docs/installation"
                title="Installation"
              >
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem
                href="https://ui.shadcn.com/docs/primitives/typography"
                title="Typography"
              >
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://ui.shadcn.com/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

/**
 * Renders a navigation list item with a linked title and description.
 *
 * @param className - Optional additional class names applied to the anchor element
 * @param title - The title text displayed above the description
 * @param children - The description content rendered below the title
 * @param props - Additional props forwarded to the underlying anchor (`<a>`) element
 * @returns The list item element (`<li>`) containing a navigation link with title and description
 */
function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "hover:bg-accent block text-main-foreground select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-hidden transition-colors hover:border-border",
            className,
          )}
          {...props}
        >
          <div className="text-base font-heading leading-none">{title}</div>
          <p className="font-base line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
ListItem.displayName = "ListItem"