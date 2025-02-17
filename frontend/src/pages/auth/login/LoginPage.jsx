import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import toast from "react-hot-toast";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/auth/login", {
        // Removed extra space
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-800">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-gray-900">
        <form
          className="flex gap-4 flex-col w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white mx-auto" />
          <h1 className="text-4xl font-extrabold text-white text-center">
            {"Let's"} go.
          </h1>

          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-800 text-white px-4 py-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-800 text-white px-4 py-2">
            <MdPassword />
            <input
              type="password"
              className="grow bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`btn rounded-full btn-primary text-white ${
              loginMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {loginMutation.isError && (
            <p className="text-red-500 text-center">
              {loginMutation.error?.message}
            </p>
          )}
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg text-center">
            {"Don't"} have an account?
          </p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
