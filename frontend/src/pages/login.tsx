import { useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedUserData = urlParams.get("user");
    const token = urlParams.get("token");

    if (encodedUserData && token) {
      try {
        const userData = JSON.parse(atob(encodedUserData));

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("auth_token", token);
        router.replace(`/profiles/${userData.id}`);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/login");
      }
    } else {
      
      window.location.href = "https://alumni-tracker-sprint3-84062556e525.herokuapp.com/admins/auth/google_oauth2";
      // window.location.href = "http://localhost:4000/admins/auth/google_oauth2";

    }
  }, [router]);

  return <div>Redirecting to Google OAuth...</div>;
};

export default Login;
