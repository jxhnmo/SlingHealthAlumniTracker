import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        console.log("Google Client ID:", process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "Not Defined");
        // Redirect user to backend's OAuth login route
        window.location.href = "http://localhost:4000/admins/auth/google_oauth2";
        
      } catch (error) {
        console.error("OAuth login failed", error);
        
      }
    };

    fetchAuth();
  }, []);

  return (
    <div>
      <p>Redirecting to Google OAuth...</p>
    </div>
  );
};

export default Login;
