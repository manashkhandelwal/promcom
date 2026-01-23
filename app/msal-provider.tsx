"use client";

import { useEffect } from "react";
import { initializeMsal } from "@/lib/msal";

export default function MsalProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        initializeMsal().catch(console.error);
    }, []);

    return <>{children}</>;
}
