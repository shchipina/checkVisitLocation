import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createVisit } from "../api/visits/visits";
import { fetchLocation } from "../api/locations/locations";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { useAppSelector } from "../hooks/reduxHook";
import { useState } from "react";
import type { Location } from "../types/location";

const AddVisitForm = () => {
  const token = useAppSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const [selectedLocationId, setSelectedLocationId] = useState(0);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({
    impressions: "",
    rating: 5,
    visitDate: "2025-05-20",
  });

  const { data: locations = [], isLoading: isLocationsLoading } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => fetchLocation(token),
  });

  const filteredLocations = query === ""
    ? locations
    : locations.filter(loc =>
        loc.name.toLowerCase().includes(query.trim().toLowerCase())
      );

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
      setFormData({ impressions: '', rating: 5, visitDate: '2025-05-18' });
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

    mutation.mutate({ ...formData, locationId: selectedLocationId });
  };

  return (
    <section className="bg-white shadow-md p-6 rounded-xl w-full">
      <h3 className="text-xl font-bold mb-4 text-green-700">➕ Додати відвідування</h3>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Локація:</label>
          {isLocationsLoading ? (
            <p className="text-gray-500">Завантаження локацій...</p>
          ) : (
            <Combobox 
              value={selectedLocationId} 
              onChange={setSelectedLocationId}
            >
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
  );
};

export default AddVisitForm;
