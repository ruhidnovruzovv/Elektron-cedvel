import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import VerifyCode from './pages/Authentication/VerifyCode';
import ResetPassword from './pages/Authentication/ResetPassword';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UsersTable from './pages/UsersTable';
import AddNewUser from './pages/AddNewUser';
import EditUser from './pages/EditUser';
import Role from './pages/Role';
import AddRole from './pages/AddRole';
import EditRole from './pages/EditRole';
import PermissionsTable from './pages/PermissionsTable';
import FacultyPage from './pages/Faculty';
import DepartmentPage from './pages/Department';
import UserViewPage from './pages/UserViewPage';
import CourseSpecialitiesPage from './pages/CourseSpecialitiesPage';
import LessonsType from './pages/LessonType';
import Groups from './pages/Groups';
import Corps from './pages/Corps';
import RoomType from './pages/RoomType';
import Hours from './pages/Hours';
import Lessons from './pages/Lessons';
import Rooms from './pages/Rooms';
import WeekTypes from './pages/WeekTypes';
import Smestrs from './pages/Semestrs';
import Schedule from './pages/Schedule';
import AddScheduleLesson from './pages/AddScheduleLesson';
import EditLessonInShedule from './pages/EditLessonInShedule';
import CoursePage from './pages/CoursePage';
import FacultyDetails from './pages/FacultyDetails';
import DeparmentDetails from './pages/DeparmentDetails';
import Specialities from './pages/Specialities';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Routes>
                    <Route index element={<ECommerce />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="forms/form-elements" />
                    <Route path="tables" element={<Tables />} />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute requiredPermission="user_show">
                          <UsersTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="add-new-user"
                      element={
                        <ProtectedRoute requiredPermission="user_add">
                          <AddNewUser />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="edit-user/:id"
                      element={
                        <ProtectedRoute requiredPermission="user_edit">
                          <EditUser />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="role"
                      element={
                        <ProtectedRoute requiredPermission="role_show">
                          <Role />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="add-role"
                      element={
                        <ProtectedRoute requiredPermission="role_add">
                          <AddRole />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="edit-role/:id"
                      element={
                        <ProtectedRoute requiredPermission="role_edit">
                          <EditRole />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="permissions"
                      element={
                        <ProtectedRoute requiredPermission="permission_show">
                          <PermissionsTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="settings" element={<Settings />} />
                    <Route path="faculty" element={<FacultyPage />} />
                    <Route path="department" element={<DepartmentPage />} />
                    <Route path="specialities" element={<Specialities />} />
                    <Route path="view-user/:id" element={<UserViewPage />} />
                    <Route path="course" element={<CoursePage />} />
                    <Route path="lesson-type" element={<LessonsType />} />
                    <Route path="faculty/:id" element={<FacultyDetails />} />
                    <Route path="departments/:id" element={<DeparmentDetails />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="corps" element={<Corps />} />
                    <Route path="room-types" element={<RoomType />} />
                    <Route path="hours" element={<Hours />} />
                    <Route path="lessons" element={<Lessons />} />
                    <Route path="rooms" element={<Rooms />} />
                    <Route path="weeks-types" element={<WeekTypes />} />
                    <Route path="smestrs" element={<Smestrs />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route
                      path="add-schedule-lesson"
                      element={<AddScheduleLesson />}
                    />
                    <Route
                      path="schedule-lesson/:id"
                      element={<EditLessonInShedule />}
                    />
                  </Routes>
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </AuthProvider>
  );
}

export default App;
