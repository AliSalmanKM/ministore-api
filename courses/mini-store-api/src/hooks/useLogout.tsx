import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({
      access_token: "",
      user: {
        email: "",
        first_name: "",
        last_name: "",
        _id: "",
      },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return logout;
};

export default useLogout;
