import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicRoute } from '../HOCs/PublicRoute';
import { PrivateRoute } from '../HOCs/PrivateRoute';

import { fetchCurrentUser } from '../redux/auth/authOperations';

import { selectIsLoading } from '../redux/auth/authSelectors';
import { selectIsFetchingCurrentUser } from '../redux/auth/authSelectors';

import { Layout } from './Layout/Layout';
import { Loader } from './Loader/Loader';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const UserPage = lazy(() => import('../pages/UserPage/UserPage'));
const NoticesPage = lazy(() => import('../pages/NoticesPage/NoticesPage'));
const OurFriendsPage = lazy(() =>
  import('../pages/OurFriendsPage/OurFriendsPage')
);
const NewsPage = lazy(() => import('../pages/NewsPage/NewsPage'));
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));

// ===================================================
export const App = () => {
  const isFetchingCurrentUser = useSelector(selectIsFetchingCurrentUser);
  const isLoading = useSelector(selectIsLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      {!isFetchingCurrentUser && (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route
              path="register"
              element={
                <PublicRoute restricted>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute restricted>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="news"
              element={
                <PublicRoute>
                  <NewsPage />
                </PublicRoute>
              }
            />
            <Route
              path="notices/:route"
              element={
                <PublicRoute>
                  <NoticesPage />
                </PublicRoute>
              }
            />

            <Route
              path="friends"
              element={
                <PublicRoute>
                  <OurFriendsPage />
                </PublicRoute>
              }
            />
            <Route
              path="user"
              element={
                <PrivateRoute>
                  <UserPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
      {isLoading && <Loader />}
    </>
  );
};
