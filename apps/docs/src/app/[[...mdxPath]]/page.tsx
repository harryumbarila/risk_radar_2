import type { Metadata } from 'next';
import type { $NextraMetadata, Heading } from 'nextra';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import type { FC } from 'react';

// eslint-disable-next-line no-restricted-imports
import { useMDXComponents as getMDXComponents } from '../../../mdx-components';

const Wrapper = getMDXComponents().wrapper;

type Params = {
  mdxPath: string[];
};

type PageProps = {
  params: Promise<Params>;
  [key: string]: unknown;
};

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { metadata } = (await importPage(params.mdxPath)) as {
    metadata: Metadata;
  };
  return metadata;
}

const Page: FC<PageProps> = async ({ params: paramsPromise, ...props }) => {
  const params = await paramsPromise;
  const result = (await importPage(params.mdxPath)) as {
    default: FC<PageProps>;
    toc: Heading[];
    metadata: $NextraMetadata;
  };

  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={paramsPromise} />
    </Wrapper>
  );
};

export default Page;
