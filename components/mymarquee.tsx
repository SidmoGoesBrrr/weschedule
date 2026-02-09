import Marquee from "@/components/ui/marquee"

/**
 * Render a Marquee populated with five static items.
 *
 * @returns A React element containing a Marquee with the items "Item 1" through "Item 5".
 */
export default function MarqueeDemo() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]

  return <Marquee items={items} />
}