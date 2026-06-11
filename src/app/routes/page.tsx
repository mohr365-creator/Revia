import { redirect } from "next/navigation";

/** The routes section now splits into Lost Connections and Revia Restoration. */
export default function RoutesPage() {
  redirect("/routes/lost-connections");
}
