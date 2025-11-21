"use client"

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders a themed navigation menu root that optionally includes a viewport element.
 *
 * @param viewport - If `true`, renders the associated viewport for menu content. Defaults to `true`.
 * @returns The NavigationMenu root element with provided children and optional viewport.
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "relative z-10 flex max-w-max rounded-base font-heading border-border border-2 p-1 bg-main flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/**
 * Render a styled wrapper around Radix's NavigationMenu list with consistent layout and spacing.
 *
 * @returns The rendered NavigationMenuPrimitive.List element with composed class names and forwarded props.
 */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center font-heading justify-center space-x-1",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Wraps a navigation menu item and applies a base layout class plus a data-slot attribute.
 *
 * @param className - Additional CSS classes to merge with the base `"relative"` class
 * @param props - All other props forwarded to the underlying NavigationMenuPrimitive.Item
 * @returns The rendered navigation menu item element
 */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center text-main-foreground rounded-base bg-main px-4 py-2 text-sm font-heading transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
)

/**
 * Render a styled navigation menu trigger that includes a trailing chevron icon.
 *
 * @param className - Additional CSS classes to merge with the trigger's base styles.
 * @param children - Content displayed inside the trigger (e.g., label or icon).
 * @returns The navigation menu trigger element with a chevron that rotates when the trigger is open.
 */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        className="relative top-[1px] ml-2 size-4 font-heading transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

/**
 * Renders the content panel for a navigation menu with built-in motion, responsive positioning, and viewport-aware styling.
 *
 * @returns A configured NavigationMenu content element ready to be used inside a Radix NavigationMenu.
 */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-main group-data-[viewport=false]/navigation-menu:text-main-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders a pre-styled navigation menu link.
 *
 * @param className - Additional CSS classes to merge with the component's default link styles
 * @returns A link element styled for use inside the navigation menu
 */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "block select-none space-y-1 rounded-base p-2 leading-none no-underline outline-none transition-colors focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders the positioned viewport container for the navigation menu.
 *
 * The component provides a centered, absolutely positioned wrapper and mounts Radix's
 * NavigationMenu.Viewport configured for responsive sizing and state-based animations.
 *
 * @param className - Additional class names applied to the underlying viewport element
 * @param props - Remaining properties forwarded to `NavigationMenuPrimitive.Viewport`
 * @returns The viewport React element used by the navigation menu
 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-base border-2 border-border bg-main text-main-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  )
}

/**
 * Renders the visual indicator for the navigation menu used to mark the active item.
 *
 * @returns A React element representing the menu indicator positioned beneath the active trigger.
 */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end font-heading justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-white" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}