export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface Profile {
    id: string;
    user_id: string;
    bio: string;
    avatar_url: string;
    created_at: string;
}