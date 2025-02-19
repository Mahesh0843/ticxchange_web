import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import logo from "../assets/logo1.jpg";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect } from "react";

const themes = [ "dark", "night", "synthwave", "dracula", "business", "luxury", "coffee"];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'night';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="bg-base-200 p-4 text-base-content">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link to="/" className="hover:text-gray-400">
            <img src={logo} alt="TicXchange" className="h-16" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Selector - Always visible */}
          <div className="dropdown dropdown-end">
            <select 
              className="select select-bordered select-sm"
              onChange={handleThemeChange}
              value={document.documentElement.getAttribute('data-theme')}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {!user ? (
            <ul className="flex space-x-4">
              <li>
                <Link to="/how-it-works" className="hover:text-gray-400">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/how-to-sell" className="hover:text-gray-400">
                  How to sell
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-gray-400">
                  Become a partner
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-400">
                  Login
                </Link>
              </li>
            </ul>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to={user.data?.user?.role === "seller" ? "/seller/tickets" : "/buyer/tickets"} 
                className="hover:text-gray-400"
              >
                Your Tickets
              </Link>
              
              {/* Conditionally render Upload Tickets for sellers */}
              {user.data?.user?.role === "seller" && (
                <Link to="/createticket" className="hover:text-gray-400">
                  Upload Tickets
                </Link>
              )}
              <span className="text-sm">
                Welcome, {user.data?.user?.firstName || "User"}
              </span>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User avatar"
                      src={
                        user.data?.user?.photoUrl ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="bg-gray-800 mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-white"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                      {!user.data?.user?.isVerified && (
                        <span className="badge badge-warning">Verify</span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link to="/connections">Connections</Link>
                  </li>
                  <li>
                    <Link to="/requests">Requests</Link>
                  </li>
                  <li>
                    <Link to="/profile/update-password">Forgot Password</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
