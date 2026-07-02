export interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    private: boolean;
    html_url: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}
