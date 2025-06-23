import { IoMdClose } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../api/analytics/analytics";

type AnalyticsModalProps = {
  onClose: () => void;
};

function AnalyticsModal({ onClose }: AnalyticsModalProps) {
  const { data: analyticsData, isLoading, isError } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  return (
    <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <IoMdClose size={30} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Аналітика відвідувань</h2>

        {isLoading ? (
          <p>Завантаження...</p>
        ) : isError ? (
          <p className="text-red-500">Сталася помилка при завантаженні аналітики</p>
        ) : (
          <div className="space-y-6 text-sm">
            <div className="space-y-1">
              <p><strong>Середня оцінка:</strong> {analyticsData.averageRating}</p>
              <p><strong>Загальна кількість візитів:</strong> {analyticsData.totalVisits}</p>
              <div>
                <strong>Візити за типом:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {Object.entries(analyticsData.visitsByType).map(([type, count]) => (
                    <li key={type}>{type}: {count}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <strong>Деталі візитів:</strong>
              <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {analyticsData.filteredVisits.map((visit: any) => (
                  <li key={visit.id} className="border-b pb-2">
                    <p><strong>Дата:</strong> {visit.visitDate}</p>
                    <p><strong>Оцінка:</strong> {visit.rating}</p>
                    <p><strong>Враження:</strong> {visit.impressions}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsModal;
