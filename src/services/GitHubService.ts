import axios from 'axios';
import { GithubUser } from '../interfaces/GithubUser';
import { Repository } from '../interfaces/Repository';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';

const API_URL = import.meta.env.VITE_GITHUB_API_URL || 'https://api.github.com';
const API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
});

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : String(error);
};

export const fetchRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await githubApi.get<Repository[]>('/user/repos', {
      params: {
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        affiliation: 'owner'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createRepository = async (
  repository: RepositoryPayload
): Promise<Repository> => {
  try {
    const response = await githubApi.post<Repository>('/user/repos', repository);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateRepository = async (
  owner: string,
  repositoryName: string,
  changes: Partial<RepositoryPayload>
): Promise<Repository> => {
  try {
    const response = await githubApi.patch<Repository>(
      `/repos/${owner}/${repositoryName}`,
      changes
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteRepository = async (
  owner: string,
  repositoryName: string
): Promise<void> => {
  try {
    await githubApi.delete(`/repos/${owner}/${repositoryName}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const fetchUserInfo = async (): Promise<GithubUser> => {
  try {
    const response = await githubApi.get<GithubUser>('/user');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
