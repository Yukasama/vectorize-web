export const uploadGithub = async (githubUrl: string) => {
  const response = await fetch('/add_model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ github_url: githubUrl }),
  });

  if (!response.ok) {
    throw new Error('GitHub-Upload fehlgeschlagen');
  }

  return await response.json();
};
