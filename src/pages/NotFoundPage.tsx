import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import errorImage from "../../public/404.webp"

function NotFoundPage() {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }

        return prev - 1;
      }
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="">
        <h2 className="text-[36px] font-medium">Ooops...</h2>
        <h3 className="text-[28px] font-medium mb-10">Page not found</h3>
        <Link to="/" className="bg-black text-white py-3 px-6 rounded">
          Go Back
        </Link>
        <p className="mt-4 text-gray-600">Redirecting to homepage in {count} seconds...</p>
      </div>
      <div>
        <img src={errorImage} alt="404" />
      </div>
    </div>
  )
}

export default NotFoundPage