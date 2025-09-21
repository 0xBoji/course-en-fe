// API Response Types based on backend Swagger schema

// Difficulty levels as defined in backend
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

// Course types matching backend models.CourseResponse
export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  image_url?: string; // Optional image URL from backend
  created_at: string;
}

// Course request type matching backend models.CourseRequest
export interface CourseRequest {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

// Course form data with optional image file
export interface CourseFormData {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

// Enrollment response type matching backend models.EnrollmentResponse
export interface EnrollmentResponse {
  id: string;
  student_email: string;
  course_id: string;
  enrolled_at: string;
  course?: CourseResponse;
}

// Enrollment request type matching backend models.EnrollmentRequest
export interface EnrollmentRequest {
  student_email: string;
  course_id: string;
}

// Enrollment form data type for frontend forms
export interface EnrollmentFormData {
  student_email: string;
}

// Student enrollments response matching backend models.StudentEnrollmentsResponse
export interface StudentEnrollmentsResponse {
  student_email: string;
  total: number;
  enrollments: EnrollmentResponse[];
}

// Error response type matching backend handler.ErrorResponse
export interface ErrorResponse {
  error: string;
  message: string;
}

// API Response wrapper for consistent handling
export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
}

// UI State Types for React components
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Authentication types matching backend models
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

// Authentication state for React components
export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Course search parameters
export interface CourseSearchData {
  query?: string;
  difficulty?: DifficultyLevel;
  page?: number;
  limit?: number;
}

// Student data
export interface StudentResponse {
  id: string;
  email: string;
  enrolled_at: string;
  course_count?: number;
}

// Course students response
export interface CourseStudentsResponse {
  students: string[]; // Array of email addresses
  total: number;
}

// Course students search parameters
export interface CourseStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Pagination metadata
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

// Paginated courses response
export interface PaginatedCoursesResponse {
  data: CourseResponse[];
  pagination: PaginationInfo;
}

// Convenience aliases for common usage
export type Course = CourseResponse;
export type Enrollment = EnrollmentResponse;
export type StudentEnrollments = StudentEnrollmentsResponse;
export type User = UserResponse;
export type AuthUser = UserResponse;
