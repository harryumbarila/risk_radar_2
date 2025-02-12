import { notFound } from "next/navigation";

interface Props {
  params: {
    merchant_id: string;
  };
}

export default async function RiskRadarMerchantPage({ params }: Props) {
  const { merchant_id } = params;

  // You can add validation here
  if (!merchant_id) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Merchant Details</h1>
      <p>Merchant ID: {merchant_id}</p>
      {/* Add your merchant-specific content here */}
    </div>
  );
}
