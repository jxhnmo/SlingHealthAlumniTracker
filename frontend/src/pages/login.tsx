import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    const fetchAuth = async () => {
      try {
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
