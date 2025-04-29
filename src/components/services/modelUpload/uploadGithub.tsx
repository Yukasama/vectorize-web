import axios from 'axios';

export const uploadGithub = async (githubUrl: string) => {
  try {
    const { data } = await axios.post(
      'http://localhost:8000/v1/uploads/add_model',
      {
        github_url: githubUrl,
      },
    );
    return data;
  } catch {
    throw new Error('Fehler beim Hochladen des GitHub-Modells');
  }
};
