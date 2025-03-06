export type SidebarItemType = {
  label: string;
  route: string;
  icon: JSX.Element;
  children?: SidebarItemType[];
};
