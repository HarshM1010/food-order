import React, { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast'; // Make sure to install react-hot-toast
import { User, Briefcase, Phone, Lock } from 'lucide-react';

// Adjust the API endpoint if your backend is deployed elsewhere
const API = "http://localhost:5000/api/auth"; 

// --- FIXED: InputField component is now defined OUTSIDE AuthPage ---
// This prevents it from being re-created on every render, solving the focus issue.
const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
      <Icon className="w-5 h-5 text-slate-400" />
    </div>
    <input 
      {...props}
      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all"
    />
  </div>
);

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    role: "user", // Default role
  });

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      mobile: "",
      password: "",
      role: form.role, // Keep the selected role
    });
  };

  const handleRoleChange = (newRole) => {
    setForm({ ...form, role: newRole });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const signup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, mobile, password, role } = form;
    if (!firstName || !lastName || !mobile || !password) {
        toast.error("Please fill in all fields.");
        return;
    }

    const loadingToast = toast.loading("Creating your account...");
    try {
      await axios.post(`${API}/signup`, { firstName, lastName, mobile, password, role });
      toast.success("Signup successful! Please log in.", { id: loadingToast });
      setIsSignup(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.", { id: loadingToast });
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const { mobile, password, role } = form;
     if (!mobile || !password) {
        toast.error("Please enter mobile and password.");
        return;
    }

    const loadingToast = toast.loading("Logging in...");
    try {
      const res = await axios.post(`${API}/login`, { mobile, password, role });
      toast.success(res.data.message || "Login successful!", { id: loadingToast });
      console.log("Logged in user:", res.data.user);
      // TODO: Handle successful login (e.g., save token, redirect user)
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.", { id: loadingToast });
    }
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 p-4">
      <div className="text-center mb-8">
         <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to UniServe
          </h1>
          <p className="mt-3 text-lg text-slate-500">Your one-stop campus solution.</p>
      </div>
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-slate-200/50">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
          {isSignup ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-slate-500 mb-6">
          {isSignup ? "Get started by creating a new account." : "Access your account."}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-100 p-1.5 rounded-xl">
          <button
            type="button" // Prevent form submission
            onClick={() => handleRoleChange('user')}
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${form.role === 'user' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <span className="flex items-center justify-center gap-2"><User size={18}/> User</span>
          </button>
          <button
            type="button" // Prevent form submission
            onClick={() => handleRoleChange('vendor')}
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${form.role === 'vendor' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <span className="flex items-center justify-center gap-2"><Briefcase size={18}/> Vendor</span>
          </button>
        </div>

        <form onSubmit={isSignup ? signup : login}>
          {isSignup && (
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} icon={User} />
              <InputField name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} icon={User} />
            </div>
          )}

          <InputField name="mobile" type="tel" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} icon={Phone} />
          <InputField name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} icon={Lock} />

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg shadow-blue-500/30"
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
            onClick={toggleAuthMode}
          >
            {isSignup ? "Login here" : "Signup now"}
          </span>
        </p>
      </div>
    </div>
  );
}

