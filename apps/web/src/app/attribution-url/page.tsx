"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { showNotification } from "@/components/Notifications/NotificationContent";
import { useUsersData } from "@/hooks/attribution-url/useUsersData";

const AttributionUrl: React.FC = () => {
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useUsersData();

  const [irisUser, setIrisUser] = useState("");
  const [channel, setChannel] = useState("");
  const [rsl, setRsl] = useState("");
  const [resellerPartner, setResellerPartner] = useState("");
  const [referralPartner, setReferralPartner] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = () => {
    // 1. Validation
    if (!irisUser || !channel || !rsl) {
      showNotification({
        title: "Validation Error",
        message: "IRIS User, Channel and RSL are required fields",
        type: "error",
        bgColor: "#FF0000",
      });
      return;
    }

    // 2. Construct the attribution object
    const attributionData = {
      user_id: irisUser,
      channel_id: channel,
      rsl_user_id: rsl,
      reseller_partner_user_id: resellerPartner || "",
      referral_partner_user_id: referralPartner || "",
    };

    // 3. Convert to Base64
    const encodedData = btoa(JSON.stringify(attributionData));

    // 4. Construct the final URL
    const link = `https://apply.taluspay.com/attr/${encodedData}`;

    setGeneratedLink(link);

    showNotification({
      title: "Success",
      message: "Attribution link generated successfully",
      type: "success",
      bgColor: "#4CAF50",
    });
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      showNotification({
        title: "Success",
        message: "Operation completed successfully",
        type: "success",
        bgColor: "#4CAF50",
      });
    }
  };

  const handleIrisUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setIrisUser(selectedValue);

    // Find the selected user and get their RSL
    const selectedUser = usersData?.data?.find(
      (user) => user.value === parseInt(selectedValue),
    );
    setRsl(selectedUser?.rsl || "No Supervisor");
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Attribution URL Generator" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Talus Attribution URL Builder
          </h3>
        </div>
        <div className="p-6.5">
          {/* IRIS User */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Choose IRIS User
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={irisUser}
                onChange={handleIrisUserChange}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select IRIS User</option>
                {usersData?.data?.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Channel */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Channel
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Channel</option>
                <option value="Direct">Direct</option>
                <option value="Indirect">Indirect</option>
              </select>
            </div>
          </div>

          {/* RSL */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              RSL
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <input
                type="text"
                value={rsl}
                readOnly
                className="pointer-events-none relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
          </div>

          {/* Reseller Partner */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Reseller Partner
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={resellerPartner}
                onChange={(e) => setResellerPartner(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Reseller Partner</option>
                <option value="Partner1">Partner1</option>
                <option value="Partner2">Partner2</option>
              </select>
            </div>
          </div>

          {/* Referral Partner */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Referral Partner
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={referralPartner}
                onChange={(e) => setReferralPartner(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Referral Partner</option>
                <option value="Referral1">Referral1</option>
                <option value="Referral2">Referral2</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateLink}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Generated Link:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AttributionUrl;
