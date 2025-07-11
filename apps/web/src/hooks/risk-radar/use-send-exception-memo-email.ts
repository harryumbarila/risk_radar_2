import useBaseApi from '@/web/src/hooks/use-base-api';

export type SendExceptionMemoEmailDto = {
  mid: number;
  emailBody: string;
  emailTemplateId: number;
  emailRecipient: string;
  user: string;
  email: string;
};

type UseSendExceptionMemoEmailReturnType = {
  sendExceptionMemoEmail: (
    params: SendExceptionMemoEmailDto
  ) => Promise<unknown>;
};

export const useSendExceptionMemoEmail =
  (): UseSendExceptionMemoEmailReturnType => {
    const { makeRequest } = useBaseApi();

    const sendExceptionMemoEmail = async (
      params: SendExceptionMemoEmailDto
    ): Promise<unknown> => {
      const response = await makeRequest(
        '/v1/risk-radar/send-exception-memo-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        }
      );

      return response;
    };

    return { sendExceptionMemoEmail };
  };
