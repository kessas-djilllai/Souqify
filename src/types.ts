export interface User {
  id: string | number;
  name: string;
  email: string;
  // Add other properties matching your PHP backend
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
