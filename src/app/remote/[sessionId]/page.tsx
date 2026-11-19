"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { MobileRemote } from "@/components/remote/MobileRemote";
import { Loader2 } from "lucide-react";

function RemoteSessionInner() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();

  const sessionId = typeof params?.sessionId === "string" ? params.sessionId : "";
  const token = searchParams.get("token") || undefined;
  const pairingCode = searchParams.get("code") || undefined;

  return <MobileRemote sessionId={sessionId} token={token} pairingCode={pairingCode} />;
}

export default function RemoteSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-white flex flex-col items-center justify-center gap-3 text-brand-navy">
          <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
          <span className="font-display text-sm font-semibold">Loading Remote Control...</span>
        </div>
      }
    >
      <RemoteSessionInner />
    </Suspense>
  );
}
