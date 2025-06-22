import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout, selectUser } from "../features/auth/authSlice";
import { persistor } from "../app/store";
import { useState } from "react";
import VisitsList from "../components/VisitsList";
import { exportData } from "../api/export/export";
import VisitModal from "../components/VisitModal";
import { FaRegUser } from "react-icons/fa";
import { CiBoxList, CiExport, CiLogout } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";

function ProfilePage() {
  const [format, setFormat] = useState<string | null>(null);
  const [isOpenModal, setIsOpenVisit] = useState(false);
  const user = useAppSelector(selectUser);
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
      const blob = await exportData(format);
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
    <main className="max-w-[1200px] mx-auto p-6 space-y-10 text-[#333]">
      <section className="flex justify-between items-center ">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-[22px] font-bold">
              <FaRegUser className="inline" /> Профіль
            </h2>
            <p className="text-gray-500 mt-1 text-[20px]">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg shadow hover:bg-rose-300 transition-colors duration-200 cursor-pointer"
            onClick={handleLogout}
          >
            <CiLogout className="inline" /> Вийти
          </button>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <CiExport /> Експортувати дані
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={format || ""}
              onChange={(e) => setFormat(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">— Оберіть формат —</option>
              {["CSV", "JSON", "TXT"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={handleSave}
              className="bg-[#F5C800] hover:bg-green-700 text-white px-5 py-2 rounded-lg transition shadow-sm cursor-pointer"
            >
              Завантажити
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-2xl px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#333]/70">
            <CiBoxList className="inline" /> Ваші візити
          </h2>
          <button
            onClick={() => setIsOpenVisit(true)}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <IoMdAdd className="group-hover:rotate-45 transition-transform duration-300 inline" /> Додати візит
          </button>
        </div>
        <VisitsList />
      </section>

      {isOpenModal && <VisitModal onClose={() => setIsOpenVisit(false)} />}
    </main>
  );
}

export default ProfilePage;
