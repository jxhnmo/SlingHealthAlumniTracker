import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        window.location.href = "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com/admins/auth/google_oauth2";
        // window.location.href = "http://localhost:4000/admins/auth/google_oauth2";
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
