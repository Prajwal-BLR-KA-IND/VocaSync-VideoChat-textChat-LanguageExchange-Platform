
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Otp from "./pages/Otp";
import LoadingScreen from "./components/LoadingScreen";
import { useAuthUser } from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import Notification from "./pages/Notification";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import FriendsPage from "./pages/FriendsPage";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isAccountVerified = authUser?.isAccountVerified;
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <LoadingScreen />;

  // Handle dynamic home route rendering
  const renderHomeRoute = () => {
    if (isAuthenticated && isAccountVerified && isOnboarded) {
      return (
        <Layout showSidebar >
          <Home />
        </Layout>
      );
    } else if (isAuthenticated && !isAccountVerified) {
      return <Navigate to="/verify-email" />;
    } else if (isAuthenticated && isAccountVerified && !isOnboarded) {
      return <Navigate to="/onboarding" />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={renderHomeRoute()} />

        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />

        <Route path="/verify-email" element={<Otp />} />

        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/onboarding"
          element={isAuthenticated ? (!isOnboarded ? (<Onboarding />) : (<Navigate to="/login" />)) : (<Navigate to="/login" />)}
        />

        <Route
          path="/notifications"
          element={isAuthenticated && isAccountVerified && isOnboarded ? (
            <Layout showSidebar >
              <Notification />
            </Layout>) : <Navigate to="/login" />}
        />

        <Route
          path="/friends"
          element={isAuthenticated && isAccountVerified && isOnboarded ? (
            <Layout showSidebar >
              <FriendsPage />
            </Layout>) : <Navigate to="/login" />}
        />

        <Route
          path="/call/:id"
          element={isAuthenticated && isAccountVerified && isOnboarded ? (
            <Layout showSidebar={false} >
              <CallPage />
            </Layout>) : <Navigate to="/login" />}
        />

        <Route
          path="/chat/:id"
          element={isAuthenticated && isAccountVerified && isOnboarded ? (
            <Layout showSidebar={false} >
              <ChatPage />
            </Layout>) : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
