import { auth } from "@/auth";
import CellComponets from "./components/CellComponets";

export default async function TopNavbar() {

  const session = await auth()
 
  return (
    <CellComponets session={session}/>
  );
}