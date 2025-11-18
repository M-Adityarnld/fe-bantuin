"use client";

import { useEffect, Suspense } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import Hero from "@/components/Hero";

function HomePageContent() {
  return (
    <PublicLayout>
      <Hero />
    </PublicLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
