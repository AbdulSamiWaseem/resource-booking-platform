"use client";

import { useState } from "react";
import { postRequest } from "./services/apiCalls";
import { toast } from "react-hot-toast";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please enter your name and email.");
      return;
    }

    const onSuccess = (res: any) => {
      toast.success(res?.message || "Successful!");
      setName("");
      setEmail("");
    };

    const onError = (err: any) => {
      toast.error(err?.message || "An error occurred.");
    };

    const route = "users";
    await postRequest({ name, email }, route, onSuccess, onError);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Resource Booking Platform</h1>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <div>
              Name
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div>
              Email
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>

      </div>
    </div>
  );
}
