import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth"; // adjust if deployed

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    otp: "",
    role: "user",
  });

  // Send OTP for signup
  const sendOtp = async () => {
    try {
      await axios.post(`${API}/send-otp`, { mobile: form.mobile });
      alert("OTP sent to your mobile");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Signup
  const signup = async () => {
    try {
      await axios.post(`${API}/signup`, form);
      alert("Signup successful!");
      setIsSignup(false);
      setOtpSent(false);
      setForm({ name: "", mobile: "", password: "", otp: "", role: "user" });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        mobile: form.mobile,
        password: form.password,
        role: form.role,
      });
      alert(res.data.message);
      console.log(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Signup" : "Login"}
        </h2>

        {/* Toggle Role */}
        <select
          className="border border-black w-full p-2 mb-4 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>

        {/* Signup Fields */}
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            className="border border-black w-full p-2 mb-4 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="text"
          placeholder="Mobile Number"
          className="border border-black w-full p-2 mb-4 rounded"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-black w-full p-2 mb-4 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Signup OTP Flow */}
        {isSignup ? (
          !otpSent ? (
            <button
              onClick={sendOtp}
              className="bg-blue-500 text-white w-full py-2 rounded mb-3 hover:bg-blue-600"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="border border-black w-full p-2 mb-4 rounded"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
              <button
                onClick={signup}
                className="bg-green-500 text-white w-full py-2 rounded mb-3 hover:bg-green-600"
              >
                Verify & Signup
              </button>
            </>
          )
        ) : (
          <button
            onClick={login}
            className="bg-blue-500 text-white w-full py-2 rounded mb-3 hover:bg-blue-600"
          >
            Login
          </button>
        )}

        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold"
            onClick={() => {
              setIsSignup(!isSignup);
              setOtpSent(false);
              setForm({ name: "", mobile: "", password: "", otp: "", role: "user" });
            }}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>
      </div>
    </div>
  );
}
