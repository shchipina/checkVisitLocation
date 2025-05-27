import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout } from "../features/auth/authSlice";
import { persistor } from "../app/store";
import { useState } from "react";
import VisitsList from "../components/VisitsList";
import { exportData } from "../api/export/export";
import VisitModal from "../components/VisitModal";

function ProfilePage() {
  const [format, setFormat] = useState<string | null>(null);
  const [isOpenModal, setIsOpenVisit] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/");
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
    <main className="max-w-[1200px] mx-auto p-6 space-y-10">
      <section className="flex justify-between items-center ">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">👤 Профіль</h2>
            <p className="text-gray-500 mt-1">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
          </div>
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow transition duration-200"
            onClick={handleLogout}
          >
            🚪 Вийти
          </button>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            ⬇️ Експортувати дані
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={format || ""}
              onChange={(e) => setFormat(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition shadow-sm"
            >
              Завантажити
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-2xl px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">📝 Ваші візити</h2>
          <button
            onClick={() => setIsOpenVisit(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            ➕ Додати візит
          </button>
        </div>
        <VisitsList />
      </section>

      {isOpenModal && <VisitModal onClose={() => setIsOpenVisit(false)} />}
    </main>
  );
}

export default ProfilePage;
