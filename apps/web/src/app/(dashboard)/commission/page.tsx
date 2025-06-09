'use client';

import { useAuth } from '@frontegg/nextjs';
import classNames from 'classnames';
import { RefreshCw, UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useListCommissionFile } from '@/hooks/paya/list-commission';
import { useUploadCommissionFile } from '@/hooks/paya/commission-file-upload-file';
import { useCommissionFileUrl } from '@/hooks/paya/use-get-commission-url';

const variantColors: Record<string, string> = {
  SUBMITTED: 'bg-green-100 border-green-300 text-green-800',
  TSYS_RESPONSE: 'bg-blue-100 border-blue-300 text-blue-800',
};

function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const CommissionPage: React.FC = () => {
  const {
    data: value,
    fetchData: fetchCommissionFile,
    isLoading,
    error,
  } = useListCommissionFile();

  const { user } = useAuth();

  const { fetchData: fetchCommissionFileUrl } = useCommissionFileUrl();
  const { uploadFile, isLoading: isLoadingUpload } = useUploadCommissionFile();

  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>(
    {}
  );

  const handleUploadClick = (fileId: string): void => {
    fileInputRefs.current[fileId]?.click();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchCommissionFile({ page, limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (error || !value?.data) {
    if (!value?.data && isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-blue-500 text-2xl" />
        </div>
      );
    }

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        Error loading data
      </div>
    );
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileId: string,
    fileMonth: string
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);
    formData.append('fileMonth', fileMonth);
    formData.append('modifiedAt', String(file.lastModified));
    formData.append('userName', user?.name || '');

    try {
      await uploadFile(formData);
      await fetchCommissionFile({ page, limit });
    } finally {
      if (fileInputRefs?.current?.[fileId]) {
        fileInputRefs.current[fileId].value = '';
      }
    }
  };

  const handleDownload = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to download again!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C50E0',
      cancelButtonColor: '#FB5454',
      confirmButtonText: 'Yes, download it!',
    });

    if (result.isConfirmed) {
      const req = await fetchCommissionFileUrl({ id, userName: user?.name || '' });

      if (!req) return;
      const link = document.createElement('a');
      link.href = req.url;
      link.download = ''; // Optional: specify a filename like 'invoice.pdf'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await fetchCommissionFile({ page, limit });
    }
  };

  const { pageCount } = value;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Commission Files</h1>

        <input
          type="text"
          placeholder="Search by file name..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <div className="space-y-4">
          {value.data.map((file) => {
            // Commission files don't have variants - they are single records
            const canUpload = !file.uploaderUserName; // Can upload if no uploader yet
            const canDownload = !file.downloaderIp; // Can download if not downloaded yet

            return (
              <div key={file.id} className="bg-white rounded-2xl shadow p-4">
                <div className="mb-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      File ID: {file.fileId}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Month: {new Date(file.fileMonth).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(file.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">File Details:</h3>
                  <div className="mt-2">
                    <div className="border rounded-xl p-3 bg-blue-100 border-blue-300 text-blue-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Commission File
                          </p>
                          <p className="text-xs text-gray-600">
                            S3 Path: {file.s3DirectoryPath || file.originalS3Key}
                          </p>
                          {file.recordCount && (
                            <p className="text-xs text-gray-600">
                              Records: {file.recordCount}
                            </p>
                          )}
                          {file.revenueTotal && (
                            <p className="text-xs text-gray-600">
                              Revenue: ${file.revenueTotal}
                            </p>
                          )}
                          {file.downloaderUserName && (
                            <p className="text-xs text-gray-600">
                              Downloaded by: {file.downloaderUserName}
                            </p>
                          )}
                          {file.uploaderUserName && (
                            <p className="text-xs text-gray-600">
                              Uploaded by: {file.uploaderUserName}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>
                            {new Date(file.createdAt).toLocaleString()}
                          </p>
                          {canDownload ? (
                            <button
                              type="button"
                              className="flex w-full justify-center rounded p-1 font-medium text-gray bg-primary hover:bg-opacity-90"
                              onClick={() => handleDownload(file.id)}
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-xs text-red-500">
                              Already Downloaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionPage; 