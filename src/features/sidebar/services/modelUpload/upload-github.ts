import { client } from '@/lib/client';
import { getBackendErrorMessage } from '@/lib/error-utils';

/**
 * Upload a model from a GitHub repository by owner, repo, and optional revision (branch/tag).
 */
export const uploadGithub = async (
  owner: string,
  repo: string,
  revision?: string,
): Promise<void> => {
  try {
    await client.post('/uploads/github', {
      owner,
      repo_name: repo,
      revision: revision ?? undefined,
    });
  } catch (error: unknown) {
    const errorMessage = getBackendErrorMessage(error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        throw new Error(`not found: ${errorMessage}`);
      }
    }

    throw new Error(errorMessage);
  }
};
