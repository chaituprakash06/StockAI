"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context"; // Corrected path

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-purple-500 border-l-transparent border-r-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}