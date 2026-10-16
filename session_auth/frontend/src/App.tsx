import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/routes/ProtectRoutes";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const isAuthenticated: boolean = true;

  return (
    <Routes>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
