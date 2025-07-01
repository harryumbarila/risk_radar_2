import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  // remove this if we can ever get dependabot to follow the rules
  // https://github.com/dependabot/dependabot-core/issues/2445
  ignores: [(message) => message.includes('Signed-off-by: dependabot[bot]')],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'scope-enum': [2, 'always', ['api', 'web', 'ui', 'shared', 'db', 'ci']],
  },
};

export default config;
