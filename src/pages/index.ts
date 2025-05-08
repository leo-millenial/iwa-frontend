import { RouteView, createRoutesView } from "@argon-router/react";

const pages = import.meta.glob<true, string, { default: RouteView }>("./**/index.route.ts", {
  eager: true,
});

const routes = Object.values(pages).map((page) => page.default);

export const Pages = createRoutesView({ routes });
