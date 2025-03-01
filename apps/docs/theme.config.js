import { useConfig } from 'nextra-theme-docs';

/* eslint sort-keys: error */
/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
export default {
  project: {
    link: 'https://github.com/jobox-team/Denali',
  },
  docsRepositoryBase:
    'https://github.com/jobox-team/Denali/tree/develop/apps/docs',
  // banner: {
  //   key: 'Denali',
  //   text: 'Denali',
  // },
  logo: (
    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      ✦ Denali Documentation
    </span>
  ),
  faviconGlyph: '✦',
  useNextSeoProps() {
    const { frontMatter } = useConfig();
    return {
      description: frontMatter.description || `Denali's Documentation`,
      openGraph: {
        images: [{ url: frontMatter.image || '' }],
      },
      titleTemplate: '%s Documentation',
    };
  },
};
