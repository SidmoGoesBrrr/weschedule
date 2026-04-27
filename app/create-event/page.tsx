import SonnerDemo from "@/components/mysonner"
import AlertDialogDemo from "@/components/myalertdialog"
/**
 * Renders a simple page with a "Hello World" header and the SonnerDemo and AlertDialogDemo components.
 *
 * @returns The component's JSX element containing the header and the two demo components.
 */
export default function Home() {
  return (
   
    <div>
      <h1>Hello World</h1>
      <SonnerDemo />
      <AlertDialogDemo />
    </div>
  );
}