import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get authenticated user
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to logout");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? "animate-enter" : "animate-leave"} 
        bg-black border border-gray-700 p-4 rounded-xl shadow-lg max-w-xs`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-white text-lg">Are you sure you want to logout?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                logout();
              }}
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const activeLinkClass = "font-bold";
  const linkClass =
    "flex gap-3 items-center hover:bg-stone-900 transition-colors rounded-full p-2 md:pr-4 md:pl-3 max-w-fit cursor-pointer";

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full z-50 bg-black">
        <Link
          to="/"
          className="flex justify-center md:justify-start hover:bg-stone-900 rounded-full m-2 p-2 transition-colors"
          aria-label="Home"
        >
          <XSvg className="w-8 h-8 fill-white" />
        </Link>

        <nav className="flex flex-col gap-1 mt-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ""}`
            }
            aria-label="Home"
          >
            <MdHomeFilled className="w-8 h-8" />
            <span className="text-xl hidden md:block">Home</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ""}`
            }
            aria-label="Notifications"
          >
            <IoNotifications className="w-7 h-7" />
            <span className="text-xl hidden md:block">Notifications</span>
          </NavLink>

          <NavLink
            to={`/profile/${authUser?.username}`}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : ""}`
            }
            aria-label="Profile"
          >
            <FaUser className="w-6 h-6" />
            <span className="text-xl hidden md:block">Profile</span>
          </NavLink>
        </nav>

        {authUser && (
          <div className="mt-auto mb-4 mx-2">
            <div className="flex items-center justify-between gap-2 p-2 md:px-4 hover:bg-stone-900 rounded-full transition-colors">
              <Link
                to={`/profile/${authUser.username}`}
                className="flex flex-1 gap-2 items-center"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={authUser?.profileImg || "/avatar-placeholder.png"}
                      alt={`${authUser?.username || "user"} profile`}
                    />
                  </div>
                </div>
                <div className="hidden md:block flex-1">
                  <p className="text-white font-bold text-sm truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">
                    @{authUser?.username}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isPending}
                aria-label="Logout"
                className="hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiLogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
