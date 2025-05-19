import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout } from "../features/auth/authSlice";
import { persistor } from "../store/store";
import VisitsList from "../components/VisitsList";
import AddVisitForm from "../components/AddVisitForm";


function ProfilePage() {
  const user = useAppSelector(state => state.auth.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate('/');
  };

  return (
    <main className="mx-auto p-6">
      <Link to="/" >Back</Link>
      <section className="mb-8 flex justify-between items-center bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800">
          👤 <span className="text-gray-500">Username:</span> {user?.username}
        </h2>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
          onClick={handleLogout}
        >
          🚪 Вийти
        </button>
      </section>

      <section className="flex gap-4">
        <VisitsList />
        <AddVisitForm />
      </section>
    </main>
  );
}

export default ProfilePage;
