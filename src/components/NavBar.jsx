import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import logo from "../assets/logo1.jpg";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";


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

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link to="/" className="hover:text-gray-400">
            <img src={logo} alt="TicXchange" className="h-16" />
          </Link>
        </div>

        {!user ? (
          <ul className="flex space-x-4 ml-auto">
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
            <Link to="/seller/tickets" className="hover:text-gray-400">
              Your Tickets
            </Link>
            <Link to="/your-listings" className="hover:text-gray-400">
              Your Listings
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
                  <Link to="/premium">Cart</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
