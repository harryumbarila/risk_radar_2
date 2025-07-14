import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';

const docsComponents = getDocsMDXComponents();

type MDXComponents = ReturnType<typeof getDocsMDXComponents>;

export const useMDXComponents = (
  components?: Readonly<MDXComponents>
): MDXComponents => ({
  ...docsComponents,
  ...components,
});
