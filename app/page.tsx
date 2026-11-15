"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePortal } from "@/lib/store";

export default function Start() {
  const { ready, signedIn } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (ready) router.replace(signedIn ? "/dashboard" : "/login");
  }, [ready, signedIn, router]);

  return (
    <div className="grid min-h-dvh place-items-center" role="status">
      <p className="text-muted">Opening your portal…</p>
    </div>
  );
}
