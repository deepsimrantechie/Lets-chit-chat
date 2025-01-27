import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useChtStore } from "../store/UseChatstore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChtStore();
  const { onlineUsers = [] } = useAuthStore(); // Default to empty array if undefined
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [error, setError] = useState(null); // Error state for fetching users

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null); // Reset error before fetching
        await getUsers();
      } catch (err) {
        setError("Failed to load users. Please try again."); // Set error message
      }
    };
    fetchUsers();
  }, [getUsers]);

  const onlineUserCount = Array.isArray(onlineUsers) ? onlineUsers.length : 0;

  const filteredUsers = showOnlineOnly
    ? users.filter(
        (user) => Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
      )
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUserCount} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {error ? (
          <div className="text-center text-red-500 py-4">
            {error}{" "}
            <button
              onClick={() => {
                setError(null); // Clear error
                getUsers(); // Retry fetching users
              }}
              className="text-blue-500 underline"
            >
              Retry
            </button>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                {Array.isArray(onlineUsers) &&
                  onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
