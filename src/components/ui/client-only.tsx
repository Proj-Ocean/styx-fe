"use client";

import { ReactNode, useLayoutEffect, useState } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const [clientOnly, setClientOnly] = useState(false);
  useLayoutEffect(() => setClientOnly(true), []);

  if (clientOnly) return children;
  return null;
}
