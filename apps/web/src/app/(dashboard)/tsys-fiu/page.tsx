'use client';

import classNames from 'classnames';
import { RefreshCw, UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useListTsysFiuFile } from '@/web/src/hooks/paya/list-tsys-fiu';
import { useUploadTsysFiuFile } from '@/web/src/hooks/paya/tsys-fiu-file-upload-file';
import { useTsysFiuFileUrl } from '@/web/src/hooks/paya/use-get-tsys-fiu-url';

const variantColors: Record<string, string> = {
  SUBMITTED: 'bg-green-100 border-green-300 text-green-800',
  TSYS_RESPONSE: 'bg-blue-100 border-blue-300 text-blue-800',
};

const TsysFiuPage: React.FC = () => {
  const {
    data: value,
    fetchData: fetchTsysFiuFile,
    isLoading,
    error,
  } = useListTsysFiuFile();

  const { fetchData: fetchTsysFiuFileUrl } = useTsysFiuFileUrl();
  const { uploadFile, isLoading: isLoadingUpload } = useUploadTsysFiuFile();

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
    fetchTsysFiuFile({ page, limit });
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
    variant: string
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);
    formData.append('modifiedAt', String(file.lastModified));
    formData.append('variant', variant);

    try {
      await uploadFile(formData);
      await fetchTsysFiuFile({ page, limit });
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
      const req = await fetchTsysFiuFileUrl({ id });

      if (!req) return;
      const link = document.createElement('a');
      link.href = req.url;
      link.download = ''; // Optional: specify a filename like 'invoice.pdf'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await fetchTsysFiuFile({ page, limit });
    }
  };

  const { pageCount } = value;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Files</h1>

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
            const uploadSubmission =
              file.variants.length === 1 || file.variants.length === 2;

            const uploadVariant =
              file.variants.length === 1 ? 'SUBMITTED' : 'TSYS_RESPONSE';

            return (
              <div key={file.id} className="bg-white rounded-2xl shadow p-4">
                <div className="mb-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {file.fileName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created at: {new Date(file.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {uploadSubmission && !isLoadingUpload ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUploadClick(file.id)}
                        className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        <UploadCloud className="w-4 h-4 mr-1" /> Upload
                      </button>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        ref={(el) => {
                          fileInputRefs.current[file.id] = el;
                        }}
                        onChange={(e) =>
                          handleFileChange(e, file.id, uploadVariant)
                        }
                      />
                    </>
                  ) : null}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Status:</h3>
                  <div className="mt-2 space-y-2">
                    {file.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`border rounded-xl p-3 ${
                          variantColors[variant.variantType] ||
                          'bg-gray-100 border-gray-300 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Type: {variant.variantType}
                            </p>
                            <p className="text-xs text-gray-600">
                              Path: {variant.s3DirectoryPath}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <p>
                              {new Date(variant.createdAt).toLocaleString()}
                            </p>
                            {!variant.downloaderIp ? (
                              <button
                                type="button"
                                disabled={!!variant.downloaderIp}
                                className={classNames(
                                  'flex w-full justify-center rounded p-1 font-medium text-gray bg-primary hover:bg-opacity-90',
                                  {
                                    'bg-gray-400 cursor-not-allowed opacity-50 pointer-events-none':
                                      !!variant.downloaderIp,
                                  }
                                )}
                                onClick={() => handleDownload(variant.id)}
                              >
                                Download
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
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

export default TsysFiuPage;
