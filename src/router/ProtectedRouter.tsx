import { useAppSelector } from "../hooks/reduxHook"
import {Outlet, Navigate} from "react-router-dom";

function ProtectedRouter() {
  const token = useAppSelector(state => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRouter