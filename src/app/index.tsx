import { Toaster } from "sonner";

import { Pages } from "@/pages";

import "./styles/index.css";

export function Application() {
  return (
    <>
      <Pages />
      <Toaster richColors position="top-right" />
    </>
  );
}
