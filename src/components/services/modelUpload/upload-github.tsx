import axios from 'axios';

interface GithubUploadResponse {
  message: string;
  repository: string;
}

export const uploadGithub = async (
  githubUrl: string,
): Promise<GithubUploadResponse> => {
  try {
    const { data } = await axios.post<GithubUploadResponse>(
      'http://localhost:8000/v1/uploads/add_model',
      {
        github_url: githubUrl,
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Fehlerdetails:', error.response?.data ?? error.message);
    }
    throw new Error('Fehler beim Hochladen des GitHub-Modells');
  }
};
