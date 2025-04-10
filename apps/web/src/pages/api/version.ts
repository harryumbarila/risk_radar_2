import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

type VersionData = {
  version: string;
  branch: string;
  commit: string;
  created_at: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VersionData>
) {
  try {
    // Path to version.json file
    const versionFilePath = path.join(process.cwd(), 'version.json');

    // Check if file exists
    if (fs.existsSync(versionFilePath)) {
      // Read and parse the version file
      const versionData = JSON.parse(
        fs.readFileSync(versionFilePath, 'utf8').replace(/\n/g, ' ')
      ) as VersionData;

      // Return the version data
      res.status(200).json(versionData);
    } else {
      // Return default version data if file doesn't exist
      res.status(200).json({
        version: '1.0.0',
        branch: 'master',
        commit: 'latest',
        created_at: '',
      });
    }
  } catch (error) {
    // Return default version data in case of error
    res.status(200).json({
      version: '1.0.0',
      branch: 'master',
      commit: 'latest',
      created_at: '',
    });
  }
}
