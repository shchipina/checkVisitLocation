import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { logout } from "../features/auth/authSlice";
import { persistor } from "../store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVisit, getAllVisits } from "../api/visits/visits";
import { useState } from "react";
import { fetchLocation } from "../api/locations/locations";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import type { Location } from "../types/location";
import type { Visits } from "../types/visits";

function ProfilePage() {
  const user = useAppSelector(state => state.auth.user);
  const token = useAppSelector(state => state.auth.token);
  const queryClient = useQueryClient();
  const [selectedLocationId, setSelectedLocationId] = useState(0);
  const [query, setQuery] = useState('');

  const [formData, setFormData] = useState({
    impressions: '',
    rating: 5,
    visitDate: '2025-05-18',
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Visits[]>({
    queryKey: ["visits"],
    queryFn: () => getAllVisits(token)
  });

  const { data: locations = [], isLoading: isLocationsLoading } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => fetchLocation(token),
  });

  const mutation = useMutation({
    mutationKey: ['newVisit'],
    mutationFn: (newVisitData: {
      locationId: number;
      impressions: string;
      rating: number;
      visitDate: string;
    }) => createVisit(newVisitData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      setFormData({
        impressions: '',
        rating: 5,
        visitDate: '2025-05-18',
      });
      setSelectedLocationId(0);
      setQuery('');
    },
    onError: (error: unknown) => {
      alert("Помилка при збереженні візиту: " + String(error));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Будь ласка, оберіть локацію.");
      return;
    }

    mutation.mutate({
      ...formData,
      locationId: selectedLocationId,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate('/');
  };

  const filteredLocations = query === "" ? locations : locations.filter(loc =>
    loc.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <main className="max-w-5xl mx-auto p-6">
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

      <section className="flex justify-between gap-3">
        <section className="bg-white shadow-md p-6 rounded-xl w-full">
          <h3 className="text-xl font-bold mb-4 text-blue-700">📍 Мої відвідування:</h3>
          {!data?.length ? (
            <p className="text-gray-500">Дані відсутні</p>
          ) : (
            <ul className="space-y-2">
              {data.map((visit) => (
                <li key={visit.id} className="border border-gray-200 p-4 rounded-md bg-blue-50">
                  <p><strong>Локація:</strong> {visit.locationName}</p>
                  <p><strong>Дата:</strong> {visit.visitDate}</p>
                  <p><strong>Оцінка:</strong> ⭐ {visit.rating}</p>
                  <p><strong>Враження:</strong> {visit.impressions}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white shadow-md p-6 rounded-xl w-full">
          <h3 className="text-xl font-bold mb-4 text-green-700">➕ Додати відвідування</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Локація:</label>
              {isLocationsLoading ? (
                <p className="text-gray-500">Завантаження локацій...</p>
              ) : (
                <Combobox value={selectedLocationId} onChange={setSelectedLocationId}>
                  <div className="relative">
                    <ComboboxInput
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      displayValue={(id) => locations.find(loc => loc.id === id)?.name || ''}
                      placeholder="Почніть вводити назву..."
                      required
                    />
                    <ComboboxOptions className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                      {filteredLocations.length === 0 && (
                        <div className="p-2 text-gray-500">Нічого не знайдено</div>
                      )}
                      {filteredLocations.map((loc) => (
                        <ComboboxOption
                          key={loc.id}
                          value={loc.id}
                          className={({ active }) =>
                            `cursor-pointer px-4 py-2 ${active ? 'bg-green-100 text-green-800' : ''}`
                          }
                        >
                          {loc.name}
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </div>
                </Combobox>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Враження:</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows={5}
                value={formData.impressions}
                placeholder="Ваші враження..."
                onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Оцінка (1–5):</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex items-center gap-1 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={formData.rating === num}
                      onChange={() => setFormData({ ...formData, rating: num })}
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Дата візиту:</label>
              <input
                type="date"
                name="visitDate"
                className="border border-gray-300 rounded px-3 py-2"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition w-fit disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Збереження..." : "Зберегти 📝"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default ProfilePage;
