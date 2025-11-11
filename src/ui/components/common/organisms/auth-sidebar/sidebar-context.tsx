'use client';
import React from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  // Start with false to match server render, then sync from localStorage after mount
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Sync with localStorage after hydration
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
    setIsHydrated(true);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar-collapsed', String(newValue));
      }
      return newValue;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

