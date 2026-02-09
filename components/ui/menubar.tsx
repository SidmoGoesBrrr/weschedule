"use client"

import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Top-level Menubar component that renders a styled Radix Menubar root.
 *
 * Renders MenubarPrimitive.Root with opinionated layout, spacing, border, and background styles, accepts an optional `className` to extend styles, and forwards remaining props to the underlying Radix primitive.
 *
 * @returns The rendered Menubar root element.
 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-11 items-center space-x-1 rounded-base border-2 border-border bg-main p-1 font-base",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders a Radix Menubar Menu primitive with the `data-slot="menubar-menu"` attribute.
 *
 * @returns The menu element with `data-slot="menubar-menu"` and all received props forwarded.
 */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

/**
 * Renders a styled trigger element for a menubar item.
 *
 * @returns The menubar trigger element with default styling, a `data-slot="menubar-trigger"` attribute, and all received props forwarded.
 */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center text-main-foreground rounded-base px-3 py-1.5 text-sm border-2 border-transparent font-heading outline-none focus:border-border data-[state=open]:border-border",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders the menubar dropdown content with opinionated styling and sensible alignment defaults inside a Portal.
 *
 * @param align - Horizontal alignment of the content relative to the trigger (e.g., `"start"`, `"center"`, `"end"`).
 * @param alignOffset - Pixel offset applied to the horizontal alignment; positive moves content away from the trigger.
 * @param sideOffset - Pixel offset applied on the side axis; positive moves content away from the trigger.
 * @returns The menubar content element (wrapped in a Portal) with applied styling and alignment props.
 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-base border-2 border-border bg-main p-1 text-main-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 origin-(--radix-menubar-content-transform-origin)",
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

/**
 * Renders a grouped section inside a menubar.
 *
 * @returns A React element representing a menubar group.
 */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

/**
 * Renders menubar content into a Radix Portal and marks it with a menubar-specific data-slot.
 *
 * @param props - Props forwarded to `MenubarPrimitive.Portal` (e.g., `children`, container).
 * @returns The Portal element containing the menubar content
 */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

/**
 * Renders a submenu container for nested menu items and forwards all received props to the underlying element.
 *
 * @returns The rendered submenu element
 */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/**
 * Renders a radio group used inside the menubar.
 *
 * @returns A React element for a menubar radio group with its `data-slot` set to `"menubar-radio-group"` and all props forwarded.
 */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

/**
 * Render a menubar item element with standardized styling and optional inset padding.
 *
 * @param className - Additional class names to apply to the item root
 * @param inset - When `true`, applies inset padding to align the item content with leading indicators/icons
 * @returns A JSX element representing a menubar item with preset classes and data attributes
 */
function MenubarItem({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent px-2 py-1.5 text-sm font-base outline-hidden focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders a menubar checkbox item with a leading check indicator and optional checked state.
 *
 * @param checked - Whether the checkbox item is checked.
 * @returns A JSX element representing the menubar checkbox item.
 */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent py-1.5 pl-8 pr-2 text-sm font-base outline-hidden focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

/**
 * A radio-style menu item for the menubar with a leading circular selection indicator.
 *
 * @param children - Content to render inside the item.
 * @returns The rendered radio-style menubar item element.
 */
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent py-1.5 pl-8 pr-2 text-sm font-base outline-hidden focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

/**
 * Renders a menubar label with consistent spacing and typography, optionally indented.
 *
 * @param className - Additional class names to apply to the label container
 * @param inset - When true, applies inset padding to align with items that have leading indicators
 * @returns The rendered menubar label element
 */
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-heading data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders a horizontal separator used inside the menubar.
 *
 * @returns A styled separator element for grouping menu items within the menubar.
 */
function MenubarSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-0.5 bg-border", className)}
      {...props}
    />
  )
}

/**
 * Renders a right-aligned shortcut text element used inside a menubar item.
 *
 * @returns A `<span>` element containing the shortcut text, styled and aligned to the right.
 */
function MenubarShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-main-foreground",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Renders a submenu trigger for the menubar.
 *
 * Displays the provided children with a trailing chevron icon and supports an inset layout for aligned spacing.
 *
 * @param inset - When `true`, applies inset spacing (additional left padding) to align the trigger with inset menu items.
 * @returns The submenu trigger element containing the children and a trailing chevron icon.
 */
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      className={cn(
        "flex cursor-default select-none items-center rounded-base border-2 border-transparent px-3 py-1.5 text-sm font-base outline-hidden focus:border-border data-[state=open]:border-border data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

/**
 * Renders the content panel for a menubar submenu with preset styling and entrance/exit animations.
 *
 * @param className - Additional CSS class names merged with the component's default classes
 * @returns The submenu content element configured with default styles and forwarded props
 */
function MenubarSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-base border-2 border-border bg-main p-1 font-base text-main-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
        className,
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}