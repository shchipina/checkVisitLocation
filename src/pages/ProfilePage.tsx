import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout } from "../features/auth/authSlice";
import { persistor } from "../store/store";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AddVisitForm from "../components/AddVisitForm";
import VisitsList from "../components/VisitsList";
import { exportData } from "../api/export/export";

function ProfilePage() {
  const [format, setFormat] = useState<string | null>(null);
  const user = useAppSelector(state => state.auth.user);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate('/');
  };

  const handleSave = async () => {
    if (!format) {
      alert("Будь ласка, оберіть формат експорту");
      return;
    }

    try {
      const blob = await exportData(format, token);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visits_${user?.username}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Помилка експорту:", error);
      alert("Не вдалося завантажити файл");
    }
  };

  return (
    <main className="mx-auto p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition duration-200"
      >
        Назад
      </Link>
      <section className="mb-8 flex justify-between items-center bg-white shadow-md p-6 rounded">
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


      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">⬇️ Експортувати дані</h2>
        <div className="flex gap-4 items-center">
          <select
            value={format || ""}
            onChange={(e) => setFormat(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">— Оберіть формат —</option>
            {["CSV", "JSON", "TEXT"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Завантажити
          </button>
        </div>
      </section>
      <section className="flex gap-4">
        <VisitsList />
        <AddVisitForm />
      </section>
    </main>
  );
}

export default ProfilePage;
