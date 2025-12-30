"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateAccount } from "@lib/redux/features/auth/thunks";

const Account = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({  username: "",  email: "",  password: "",  phoneNumber: "",  receiveEmails: false,});
  const [success, setSuccess] = useState("");

  
  useEffect(() => {
    if (user) {
      setForm({  username: user.name || "",  email: user.email || "",  password: "",  phoneNumber: user.phoneNumber || "",  receiveEmails: user.receiveEmails || false,});
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({  ...prev,  [name]: type === "checkbox" ? checked : value,}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const { username, email, password, phoneNumber, receiveEmails } = form;
    const resultAction = await dispatch(
      updateAccount({name: username,  email,  password: password || undefined,  phoneNumber,  receiveEmails,})
    );
    if (updateAccount.fulfilled.match(resultAction)) {
      setSuccess("Profile updated successfully!");
      setForm((prev) => ({ ...prev, password: "" }));
    }
  };

  const inputs = [
    { label: "Username", name: "username", type: "text", placeholder: "Enter your username", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
    { label: "Password", name: "password", type: "password", placeholder: "**************", note: "Leave blank if you don’t want to change your password" },
    { label: "Phone Number", name: "phoneNumber", type: "text", placeholder: "Enter phone number" },
  ];

  return (
    <main className="min-h-screen bg-[color:var(--color-background-primary)] p-6 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)] text-center">  Account Settings</h1>

        <form onSubmit={handleSubmit} className="bg-[color:var(--color-card-bg)] border border-[color:var(--color-border-primary)] rounded-2xl p-6 shadow-sm space-y-6">
          
          {inputs.map(({ label, name, type, placeholder, required, note }) => (
            <div key={name}>
              <label className="block text-[color:var(--color-text-secondary)] mb-1 font-medium">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} required={required || false} className="w-full p-2 border border-[color:var(--color-border-primary)] rounded"/>
              {note && <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">{note}</p>}
            </div>
          ))}

          {/* Receive Emails Checkbox */}
          <div className="flex items-center gap-2">
            <input
              className="accent-[color:var(--color-cta-bg)]"  type="checkbox"  name="receiveEmails"  checked={form.receiveEmails}  onChange={handleChange}  id="receiveEmails"/>
            <label htmlFor="receiveEmails" className="text-[color:var(--color-text-secondary)]">  Receive promotional emails</label>
          </div>

          {/* Error / Success Messages */}
          {error && <p className="text-red-500 font-medium">{error}</p>}
          {success && <p className="text-green-500 font-medium">{success}</p>}

          {/* Submit Button */}
          <button type="submit" disabled={loading === "loading"} className="w-full py-3 bg-[color:var(--color-cta-bg)] text-white font-bold rounded-xl hover:brightness-110 transition">
            {loading === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Account;
