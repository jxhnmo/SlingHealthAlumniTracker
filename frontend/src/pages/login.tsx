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
        console.log("Redirecting 222222to:", `/profiles/${userData.id}`);
        router.replace(`/profiles/${userData.id}`);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/login");
      }
    } else {
      
      // window.location.href = "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com/admins/auth/google_oauth2";
      window.location.href = "http://localhost:4000/admins/auth/google_oauth2";

    }
  }, [router]);  

  return <div>Redirecting to Google OAuth...</div>;
};

export default Login;
