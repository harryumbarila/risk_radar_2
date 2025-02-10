"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FirstTimeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user has already visited
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      // Mark that the user has now visited
      localStorage.setItem("hasVisited", "true");
      // Redirect to the default page (change "/" to your default route if needed)
      router.push("/auth/signin");
    }
  }, [router]);

  // Return null as nothing needs to be rendered
  return null;
}
