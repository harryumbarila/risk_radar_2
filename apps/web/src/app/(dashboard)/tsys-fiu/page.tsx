'use client';

import {
  ChevronLeft,
  ChevronRight,
  File,
  Folder,
  RefreshCw,
} from 'lucide-react';
import React, { useState } from 'react';

import {
  formatDate,
  formatFileSize,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import { usePartnerInvoiceUrl } from '@/web/src/hooks/partner-bank/use-get-invoice-url';
import { useFilteredPartnerInvoice } from '@/web/src/hooks/partner-bank/use-get-invoices';

const TyssFiuPage: React.FC = () => {
  const { data, isLoading, error, fetchData } = useFilteredPartnerInvoice();
  const { fetchData: fetchInvoiceUrl } = usePartnerInvoiceUrl();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState<{
    [key: number]: string | undefined;
  }>({ 1: undefined });
  React.useEffect(() => {
    fetchData({
      prefix: 'paya/',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (data?.nextContinuationToken && !pageTokens[currentPage + 1]) {
      setPageTokens((prev) => ({
        ...prev,
        [currentPage + 1]: data.nextContinuationToken,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.nextContinuationToken, currentPage]);

  const normalizePrefixForApi = (prefix?: string): undefined | string => {
    return prefix === '' || prefix === '/' ? undefined : prefix;
  };

  const handleDownload = (key: string) => {
    return async (): Promise<void> => {
      const req = await fetchInvoiceUrl({ key });
      if (!req) return;
      const link = document.createElement('a');
      link.href = req.url;
      link.download = ''; // Optional: specify a filename like 'invoice.pdf'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-500 text-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        Error loading data
      </div>
    );
  }

  const navigateToFolder = (folderPath: string): void => {
    fetchData({
      prefix: normalizePrefixForApi(folderPath),
      continuationToken: undefined,
    });
    setCurrentPage(1);
    setPageTokens({ 1: undefined });
  };

  const navigateUp = (): void => {
    const currentPath = data.currentPrefix;
    if (!currentPath || currentPath === '/') return;

    const parts = currentPath.split('/').filter(Boolean);
    const parentPath =
      parts.length > 1 ? `${parts.slice(0, -1).join('/')}/` : '';

    fetchData({
      prefix: normalizePrefixForApi(parentPath),
      continuationToken: undefined,
    });
    setCurrentPage(1);
    setPageTokens({ 1: undefined });
  };

  const goToPage = (page: number): void => {
    if (page === currentPage || (page > 1 && !pageTokens[page])) {
      return;
    }

    fetchData({
      prefix: normalizePrefixForApi(data.currentPrefix),
      continuationToken: pageTokens[page],
    });
    setCurrentPage(page);
  };

  const refresh = (): void => {
    fetchData({
      prefix: normalizePrefixForApi(data.currentPrefix),
      continuationToken: undefined,
    });
    setCurrentPage(1);
    setPageTokens({ 1: undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Breadcrumbs and controls */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={navigateUp}
            // disabled={!data.currentPrefix}
            className={`p-2 rounded ${data.currentPrefix ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
          >
            <ChevronLeft />
          </button>
          <div className="text-sm text-gray-600">
            {data.currentPrefix || 'Root'}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="p-2 rounded hover:bg-gray-100"
          >
            <RefreshCw />
          </button>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft />
          </button>
          <span className="text-sm">Page {currentPage}</span>
          <button
            type="button"
            onClick={() => {
              const nextPage = currentPage + 1;
              setPageTokens((prev) => ({
                ...prev,
                [nextPage]: data.nextContinuationToken,
              }));
              goToPage(nextPage);
            }}
            disabled={!data?.isTruncated}
            className={`p-2 rounded ${!data.isTruncated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Folders first */}
            {data.folders.map((folder) => {
              const folderName = folder
                .replace(data.currentPrefix || '', '')
                .replace(/\/$/, '');
              return (
                <tr
                  key={folder}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => navigateToFolder(folder)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Folder className="flex-shrink-0 h-5 w-5 text-blue-500" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">
                          {folderName}
                        </div>
                        <div className="text-sm text-gray-500">{folder}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Folder
                  </td>
                </tr>
              );
            })}

            {/* Files */}
            {data.objects.map((file) => {
              const fileName = file.Key.split('/').pop() || file.Key;
              return (
                <tr
                  key={file.Key}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={handleDownload(file.Key)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <File className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {fileName}
                        </div>
                        <div className="text-sm text-gray-500">{file.Key}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(file.LastModified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.Size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.StorageClass}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {data.objects.length === 0 && data.folders.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          This folder is empty
        </div>
      )}
    </div>
  );
};
export default TyssFiuPage;
