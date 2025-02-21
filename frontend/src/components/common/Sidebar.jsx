import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Spinner from "./LoadingSpinner"; // Assume a Spinner component exists

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get authenticated user with stale time to prevent unnecessary refetches
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Failed to logout");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogoutConfirmation = () => {
    toast.custom((t) => (
      <div
        role="dialog"
        aria-labelledby="logout-confirmation"
        className={`${t.visible ? "animate-enter" : "animate-leave"} 
          bg-black border border-gray-700 p-4 rounded-xl shadow-lg max-w-xs`}
      >
        <div className="flex flex-col gap-4">
          <p id="logout-confirmation" className="text-white text-md">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                logout();
              }}
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-blue-500 hover:text-white transition-colors"
              aria-label="Confirm logout"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              aria-label="Cancel logout"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const navLinks = [
    {
      path: "/",
      label: "Home",
      icon: <MdHomeFilled className="w-8 h-8" />,
      ariaLabel: "Home",
      end: true,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <IoNotifications className="w-7 h-7" />,
      ariaLabel: "Notifications",
    },
    {
      path: `/profile/${authUser?.username}`,
      label: "Profile",
      icon: <FaUser className="w-6 h-6" />,
      ariaLabel: "Profile",
    },
  ];

  const activeLinkClass = "font-bold text-blue-500";
  const linkBaseClass =
    "flex gap-3 items-center hover:bg-stone-900 transition-colors rounded-full p-2 md:pr-4 md:pl-3 max-w-fit cursor-pointer group";

  return (
    <aside className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full z-50 bg-black">
        <Link
          to="/"
          className="flex justify-center md:justify-start hover:bg-stone-900 rounded-full m-2 p-2 transition-colors"
          aria-label="Home"
        >
          <XSvg className="w-8 h-8 fill-white hover:fill-blue-500 transition-colors" />
        </Link>

        <nav className="flex flex-col gap-1 mt-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `${linkBaseClass} ${isActive ? activeLinkClass : "text-white"}`
              }
              aria-label={link.ariaLabel}
            >
              {link.icon}
              <span className="text-xl hidden md:block group-hover:text-blue-500 transition-colors">
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {authUser && (
          <div className="mt-auto mb-4 mx-2">
            <div className="flex items-center justify-between gap-2 p-2 md:px-4 hover:bg-stone-900 rounded-full transition-colors">
              <Link
                to={`/profile/${authUser.username}`}
                className="flex flex-1 gap-2 items-center"
                aria-label="View profile"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        authUser.profileImg ||
                        `${API_BASE_URL}/avatar-placeholder.png`
                      }
                      alt={`${authUser.fullName || "User"} profile`}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="hidden md:block flex-1">
                  <p className="text-white font-bold text-sm truncate">
                    {authUser.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">@{authUser.username}</p>
                </div>
              </Link>

              <button
                onClick={handleLogoutConfirmation}
                disabled={isLoggingOut}
                aria-label={isLoggingOut ? "Logging out" : "Logout"}
                className="hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? (
                  <Spinner size="sm" />
                ) : (
                  <BiLogOut className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
