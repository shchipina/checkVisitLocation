import { Link, NavLink } from "react-router-dom";
import logo from "../../public/icon.png";
import { FaRegUserCircle } from "react-icons/fa";
import { useAppSelector } from "../hooks/reduxHook";
import { selectUser } from "../features/auth/authSlice";

function Header() {
  const user = useAppSelector(selectUser);
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 py-3">

        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src={logo}
            alt="CheckVisitLocation"
            className="w-[35px] h-[35px] object-contain"
          />
          <span className="text-xl font-semibold text-[#333]">CheckVisitLocation</span>
        </Link>

        <nav className="flex items-center gap-6 text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative inline-block px-1 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:h-[2px] after:w-0 after:bg-current 
              after:transition-all after:duration-300 hover:after:w-full 
              ${isActive ? "font-semibold" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `relative inline-block px-1 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:h-[2px] after:w-0 after:bg-current 
              after:transition-all after:duration-300 hover:after:w-full 
              ${isActive ? "font-semibold" : ""}`
            }
          >
            Map
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `relative inline-block px-1 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:h-[2px] after:w-0 after:bg-current 
              after:transition-all after:duration-300 hover:after:w-full 
              ${isActive ? "font-semibold" : ""}`
            }
          >
            Favorites
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `relative inline-block px-1 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:h-[2px] after:w-0 after:bg-current 
              after:transition-all after:duration-300 hover:after:w-full 
              ${isActive ? "font-semibold" : ""}`
            }
          >
            {user?.username}
            <FaRegUserCircle className="text-xl inline ml-1" />
          </NavLink>

        </nav>
      </div>
    </header>
  );
}

export default Header;
