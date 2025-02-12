"use client";
import React from "react";
import AppsIcon from "@/components/AppsIcon/AppsIcon";

export default function NoAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute right-4 top-4">
        <AppsIcon dashboardEnv="staging" />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}
