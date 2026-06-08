import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/auth/AuthPage";
import LoadingScreen from "../components/auth/LoadingScreen";
import TermsAndConditions from "../components/auth/TermsAndConditions";
import { profileAPI } from "../utils/api";

const AuthFlow = () => {
  const [currentStep, setCurrentStep] = useState("auth"); // 'auth', 'terms', 'loading'
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Validate token by making an API call
        await profileAPI.getProfile();
        // User is authenticated, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        // Token is invalid, remove it and show auth page
        localStorage.removeItem('token');
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLoginSuccess = () => {
    setCurrentStep("terms");
  };

  const handleAcceptTerms = () => {
    setCurrentStep("loading");
  };

  const handleDeclineTerms = () => {
    localStorage.removeItem("token");
    setCurrentStep("auth");
  };

  const handleLoadingComplete = () => {
    navigate("/dashboard");
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'monospace'
      }}>
        Loading...
      </div>
    );
  }

  if (currentStep === "loading") {
    return (
      <LoadingScreen onComplete={handleLoadingComplete} duration={30000} />
    );
  }

  if (currentStep === "terms") {
    return (
      <TermsAndConditions
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    );
  }

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
};

export default AuthFlow;
