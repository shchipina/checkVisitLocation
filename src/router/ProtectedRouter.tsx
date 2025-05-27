import { selectToken } from "../features/auth/authSlice";
import { useAppSelector } from "../hooks/reduxHook"
import {Outlet, Navigate} from "react-router-dom";

function ProtectedRouter() {
  const token = useAppSelector(selectToken);

  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRouter