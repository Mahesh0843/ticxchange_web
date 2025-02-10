import { useState,useEffect } from "react";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const LoginForm = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home or dashboard
    }
  }, [user, navigate]);
  // State for login form
  const [email, setEmail] = useState("singulurivenu@gmail.com");
  const [password, setPassword] = useState("Qwerty@1234");
  const [error, setError] = useState("");

  // State for signup form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("buyer"); // Default role is 'buyer'

  const [isLoginForm, setIsLoginForm] = useState(true);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  // Handle signup
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
          phoneNumber,
          role,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-6">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={(e) => e.preventDefault()}>
            {!isLoginForm && (
              <>
                {/* First Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="input input-bordered w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="input input-bordered w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Phone Number */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="1234567890"
                    className="input input-bordered w-full"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Role Selection */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="button"
                className="btn btn-info"
                onClick={isLoginForm ? handleLogin : handleSignUp}
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Toggle between Login and Signup */}
          <p className="text-center mt-4">
            {isLoginForm ? "New user? " : "Already have an account? "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError(""); // Clear error when switching forms
              }}
            >
              {isLoginForm ? "Sign up here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;