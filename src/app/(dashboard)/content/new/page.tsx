import { redirect } from "next/navigation";

/** The creation flow lives in a dialog on the list page (see
 *  NewContentButton) so users never lose table/grid context. This route
 *  exists for deep-linkability (e.g. a "New" keyboard shortcut or an
 *  external link) and just forwards to the list. */
export default function NewContentPage() {
  redirect("/content");
}
