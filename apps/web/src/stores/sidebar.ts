import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type SidebarStore = {
  sidebarOpen: boolean;
  sidebarExpanded: boolean;
  setSidebarOpen: (value: boolean) => void;
  setSidebarExpanded: (value: boolean) => void;
  reset: () => void;
};

const defaultSidebarState: SidebarStore = {
  sidebarOpen: true,
  sidebarExpanded: true,
  setSidebarOpen: () => {},
  setSidebarExpanded: () => {},
  reset: () => {},
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    immer((set) => ({
      sidebarOpen: true,
      sidebarExpanded: true,
      setSidebarOpen: (value: boolean): void => {
        set({ sidebarOpen: value });
      },
      setSidebarExpanded: (value: boolean): void => {
        set({ sidebarExpanded: value });
      },
      reset: (): void => {
        set({
          sidebarOpen: defaultSidebarState.sidebarOpen,
          sidebarExpanded: defaultSidebarState.sidebarExpanded,
        });
      },
    })),
    {
      name: 'sidebar-store', // storage key
    }
  )
);
