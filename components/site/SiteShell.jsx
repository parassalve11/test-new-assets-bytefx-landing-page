"use client";

import { usePathname } from "next/navigation";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
]);

export function SiteShell({
  children,
  announcement,
  navbar,
  footer,
  atlas,
}) {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return children;
  }

  return (
    <>
      {announcement}
      {navbar}
      {children}
      {footer}
      {atlas}
    </>
  );
}
