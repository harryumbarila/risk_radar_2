'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { MerchantTransaction } from '@/data/interfaces/transaction';

interface BatchDrawerProps {
  batch: MerchantTransaction[];
  trigger?: React.ReactNode;
}

export default function BatchDrawer({ batch, trigger }: BatchDrawerProps) {
  const router = useRouter();
  
  // Get merchant info from first transaction
  const merchantInfo = batch[0];
  const batchId = merchantInfo?.mid || batch[0]?.id || 'unknown';

  const handleClick = () => {
    // Navigate to the batch detail page
    router.push(`/auto-hold/batch/${encodeURIComponent(batchId)}`);
  };

  // If trigger is provided, wrap it with onClick handler
  if (trigger) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
    );
  }

  // If no trigger, return null (shouldn't happen in normal usage)
  return null;
}
