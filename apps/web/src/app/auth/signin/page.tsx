"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NoAuthLayout from "@/components/Layouts/NoAuthLayout";

const SignIn: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    window.location.assign("/api/auth/login");
  };

  return (
    <NoAuthLayout>
      <div className="flex flex-col items-center">
        <Link className="mb-5.5 inline-block" href="/">
          <Image
            className="hidden dark:block"
            src={"https://apply.taluspay.com/assets/company-logo.svg"}
            alt="Denali Logo"
            width={176}
            height={32}
          />
          <Image
            className="dark:hidden"
            src={"https://apply.taluspay.com/assets/company-logo.svg"}
            alt="Denali Logo"
            width={176}
            height={32}
          />
        </Link>
        <input
          type="submit"
          value="Sign In"
          onClick={handleClick}
          className="w-32 cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
        />
      </div>
    </NoAuthLayout>
  );
};

export default SignIn;
