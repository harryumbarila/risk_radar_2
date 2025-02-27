import { IrisLeadSourcesResponseDto } from "@/shared/response/iris-proxy";

// example 
// source name: "Referral Partner - Lisa Dunmire"
// partner name: "Lisa Dunmire"
export const useSourceMatcher = () => {
    const findMatchingSourceNameForReferralPartner = (
        partnerName: string,
        sources: IrisLeadSourcesResponseDto['data'] = []
    ) => {
        return sources.find((source) => {
            const sourceName = source.name.toLowerCase();
            const referralPartnerName = partnerName.toLowerCase();
            return sourceName.includes('referral partner') && sourceName.includes(referralPartnerName);
        });
    };

    return { findMatchingSourceNameForReferralPartner };
};