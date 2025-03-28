import { useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedUserData = urlParams.get("user");

    if (encodedUserData) {
      try {
        // Decode the base64-encoded user data
        const userData = JSON.parse(atob(encodedUserData));

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to the homepage after storing the user data
        router.replace("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/login"); 
      }
    } else {
      window.location.href = "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com/admins/auth/google_oauth2";
      // window.location.href = "http://localhost:4000/admins/auth/google_oauth2";
    }
  }, [router]);

  return <div>Redirecting to Google OAuth...</div>;
};

export default Login;