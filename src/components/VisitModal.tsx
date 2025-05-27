import AddVisitForm from "./AddVisitForm";
import { IoMdClose } from "react-icons/io";

function VisitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 animate-fade-in">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <IoMdClose size={30} />
        </button>

        <AddVisitForm />
      </div>
    </div>
  );
}

export default VisitModal;
