// Export all custom hooks
export {
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useLogin,
  useLogout,
} from './use-auth';

export {
  useCourses,
  useCourse,
  useSearchCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from './use-courses';

export {
  useStudentEnrollments,
  useIsEnrolled,
  useCreateEnrollment,
} from './use-enrollments';

export {
  useCourseStudents,
  useRemoveStudentFromCourse,
  useAllStudents,
  useAllEnrollments,
  useDeleteEnrollment,
} from './use-students';

export { useToastNotifications } from './use-toast-notifications';
