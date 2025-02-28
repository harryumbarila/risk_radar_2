import type { IrisLeadSourcesResponseDto } from "@/shared/response/iris-proxy";

type FindMatchingSourceNameForReferralPartnerReturnType =
  | IrisLeadSourcesResponseDto["data"][number]
  | undefined;

type UseSourceMatcherReturnType = {
  findMatchingSourceNameForReferralPartner: (
    partnerName: string,
    sources?: IrisLeadSourcesResponseDto["data"],
  ) => FindMatchingSourceNameForReferralPartnerReturnType;
};

// example
// source name: "Referral Partner - Lisa Dunmire"
// partner name: "Lisa Dunmire"
export const useSourceMatcher = (): UseSourceMatcherReturnType => {
  const findMatchingSourceNameForReferralPartner = (
    partnerName: string,
    sources: IrisLeadSourcesResponseDto["data"] = [],
  ): FindMatchingSourceNameForReferralPartnerReturnType => {
    return sources.find((source) => {
      const sourceName = source.name.toLowerCase();
      const referralPartnerName = partnerName.toLowerCase();
      return (
        sourceName.includes("referral partner") &&
        sourceName.includes(referralPartnerName)
      );
    });
  };

  return { findMatchingSourceNameForReferralPartner };
};
