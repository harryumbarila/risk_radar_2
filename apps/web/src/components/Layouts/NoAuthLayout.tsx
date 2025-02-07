"use client";
import React from "react";
import AppsIcon from '@/components/AppsIcon/AppsIcon';

export default function NoAuthLayout({
                                       children,
                                     }: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex">
        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          {/* AppsIcon positioned in the top right corner */}
          <div className="absolute top-4 right-4">
            <AppsIcon dashboardEnv="staging" />
          </div>
          {/* ===== Main Content Start ===== */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </>
  );
}
