'use client';

import type { FC, PropsWithChildren } from 'react';

import { Sidebar } from '@/components/sidebar';
import { useSidebarStore } from '@/stores/sidebar';
import { Header } from '@/ui/common/header';
import { NotificationsContainer } from '@/ui/common/notifications/notification-content';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  const { sidebarOpen, sidebarExpanded, setSidebarOpen } = useSidebarStore();
  return (
    <>
      <NotificationsContainer />
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex relative min-h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div
          className={`flex-1 flex-col min-h-screen mx-0 transition-all duration-300 ease-in-out overflow-y-auto  ${
            sidebarOpen || sidebarExpanded ? 'md:ml-72' : 'md:ml-20'
          }`}
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="p-2 md:p-3 2xl:p-5">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
};
