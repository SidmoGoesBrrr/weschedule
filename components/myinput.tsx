import { Input } from "@/components/ui/input"

/**
 * Renders a single email input styled to 200px width with placeholder "Email".
 *
 * @returns A JSX element containing an Input component with type "email", className "w-[200px]", and placeholder "Email".
 */
export default function InputDemo() {
  return <Input className="w-[200px]" type="email" placeholder="Email" />
}