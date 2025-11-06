'use client';

import React from 'react';

import { QueryClient, onlineManager } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { NetworkStateContext } from 'libs/context/network';
import { localStorage } from 'data/services/local-storage';

export const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
  storage: localStorage,
  throttleTime: 3000,
});

export default function ReactQueryProvider({
  children,
}: React.PropsWithChildren) {
  const [isOnline, setIsOnline] = React.useState(true);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
    onlineManager.setOnline(navigator.onLine);
  };

  //  sometimes, the load event does not trigger on some browsers, that is why manually calling updateNetworkStatus on initial mount
  React.useEffect(() => {
    updateNetworkStatus();
  }, []);

  React.useEffect(() => {
    window.addEventListener('load', updateNetworkStatus);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('load', updateNetworkStatus);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return (
    <PersistQueryClientProvider
      persistOptions={{ persister }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
      client={queryClient}
    >
      <NetworkStateContext.Provider
        value={{
          isOnline,
        }}
      >
        {children}
      </NetworkStateContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
