import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProtectedRouter from "./router/ProtectedRouter"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import FavoritesPage from "./pages/FavoritesPage"
import NotFoundPage from "./pages/NotFoundPage"
import Header from "./components/Header"
import { useAppSelector } from "./hooks/reduxHook"
import { selectToken } from "./features/auth/authSlice"
import MapPage from "./pages/MapPage"

function App() {
  const token = useAppSelector(selectToken);
  return (
    <BrowserRouter>
      {token && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRouter />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
