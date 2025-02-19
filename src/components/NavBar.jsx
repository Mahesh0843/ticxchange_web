import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import logo from "../assets/logo1.jpg";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";

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
          {!user ? (
            <ul className="flex space-x-4 items-center">
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
                  About us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-400">
                  Login
                </Link>
              </li>
              <li className="lg:hidden">
                <div className="drawer drawer-end">
                  <input id="nav-drawer-logout" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="nav-drawer-logout" className="btn btn-ghost drawer-button">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </label>
                  </div>
                  <div className="drawer-side z-50">
                    <label htmlFor="nav-drawer-logout" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                      <li><Link to="/" className="text-lg font-semibold">Home</Link></li>
                      <li><Link to="/how-to-sell" className="text-lg">How to Sell</Link></li>
                      <li><Link to="/how-it-works" className="text-lg">How it Works</Link></li>
                      <li><Link to="/about-us" className="text-lg">About Us</Link></li>
                      <li><Link to="/login" className="text-lg">Login</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          ) : (
            <div className="flex items-center gap-8">
              <div className="dropdown">
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

              <div className="flex items-center gap-8">
                <Link 
                  to={user.data?.user?.role === "seller" ? "/seller/tickets" : "/buyer/tickets"} 
                  className="hover:text-gray-400"
                >
                  Your Tickets
                </Link>
                
                {user.data?.user?.role === "seller" && (
                  <Link to="/createticket" className="hover:text-gray-400">
                    Upload Tickets
                  </Link>
                )}

                <NotificationDropdown />

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
                    <li><Link to="/connections">Connections</Link></li>
                    <li><Link to="/requests">Requests</Link></li>
                    <li><Link to="/profile/update-password">Forgot Password</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>

                <div className="drawer drawer-end">
                  <input id="nav-drawer-login" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="nav-drawer-login" className="btn btn-ghost drawer-button">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </label>
                  </div>
                  <div className="drawer-side z-50">
                    <label htmlFor="nav-drawer-login" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                      <div className="mb-6 p-4 bg-base-300 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-12 rounded-full">
                              <img 
                                src={user.data?.user?.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                                alt="avatar" 
                              />
                            </div>
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="font-semibold truncate">
                              {user.data?.user?.firstName || "User"}
                            </h3>
                            <p className="text-sm opacity-70 truncate">
                              {user.data?.user?.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Link to="/" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          Home
                        </Link>
                        <Link to="/how-to-sell" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          How to Sell
                        </Link>
                        <Link to="/how-it-works" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          How it Works
                        </Link>
                        <Link to="/about-us" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          About Us
                        </Link>
                      </div>

                      <div className="divider my-4"></div>

                      <div className="flex flex-col gap-1">
                        <Link to="/profile" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          Profile
                        </Link>
                        <Link to="/connections" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          Connections
                        </Link>
                        <Link to="/requests" className="btn btn-ghost justify-start text-lg normal-case px-4 w-full">
                          Requests
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="btn btn-ghost justify-start text-lg normal-case px-4 w-full"
                        >
                          Logout
                        </button>
                      </div>

                      <div className="mt-auto pt-6">
                        <select 
                          className="select select-bordered w-full text-left"
                          onChange={handleThemeChange}
                          value={document.documentElement.getAttribute('data-theme')}
                        >
                          {themes.map((theme) => (
                            <option key={theme} value={theme} className="text-left">
                              {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
