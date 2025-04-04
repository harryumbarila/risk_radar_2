import { join, dirname } from 'path';

const fs = require('fs');

function findVersionFile(): string {
  // Get the directory path of the current module
  const currentDir = dirname(require.resolve('./version-resolver'));

  // When running from dist, we're in: .../dist/apps/api/src/shared/version/
  // Need to go up to dist, then back to apps/api/
  const distPath = currentDir.split('/dist/')[0];
  const versionPath = join(distPath, 'version.json');

  return versionPath;
}

export type VersionData = {
  version: string;
  branch: string;
  commit: string;
  created_at: string;
};

export class VersionResolver {
  static resolveVersion(): VersionData {
    const path = findVersionFile();

    if (fs.existsSync(path)) {
      return JSON.parse(
        fs.readFileSync(path, 'utf8').replace(new RegExp('\n', 'g'), ' ')
      );
    }

    return {
      version: '1.0.0',
      branch: 'master',
      commit: 'latest',
      created_at: '',
    };
  }
}
