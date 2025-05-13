export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  image: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  darkMode: boolean;
}