export type Role = "ADMIN" | "TOURIST" | "RESIDENT";

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: "TOURIST" | "RESIDENT";
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}



export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}