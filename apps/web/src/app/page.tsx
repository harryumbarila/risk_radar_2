import { Metadata } from "next";
import ProFormLayout from "@/app/forms/pro-form-layout/page";

export const metadata: Metadata = {
  title: "Taluspay Dashboard",
  description: "Taluspay Dashboard",
};

export default function Home() {
  return (
    <>
      <ProFormLayout />
    </>
  );
}
