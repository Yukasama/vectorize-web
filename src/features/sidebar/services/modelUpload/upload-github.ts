import { messages } from '@/lib/messages';
import axios from 'axios';

/**
 * Upload a model from a GitHub repository by owner, repo, and optional revision (branch/tag).
 */
export const uploadGithub = async (
  owner: string,
  repo: string,
  revision?: string,
): Promise<void> => {
  try {
    await axios.post('http://localhost:8000/v1/uploads/github', {
      owner,
      repo_name: repo,
      revision: revision ?? undefined,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(messages.model.upload.alreadyExists);
      }
      if (error.response?.status === 400) {
        throw new Error(messages.model.upload.githubError);
      }
      if (error.response?.status === 404) {
        throw new Error(
          messages.model.upload.githubNotFound(
            `${owner}/${repo}`,
            revision ?? 'main',
          ),
        );
      }
      // Use backend error message if available, otherwise fallback to messages
      const data = error.response?.data as
        | undefined
        | { detail?: string; message?: string };
      const backendMessage =
        data?.detail ?? data?.message ?? messages.model.upload.githubError;
      throw new Error(backendMessage);
    }
    throw new Error(messages.model.upload.githubError);
  }
};
