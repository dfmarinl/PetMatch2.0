import { Bell } from "lucide-react";

function NotificationIcon({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-200"
    >
      <Bell className="h-6 w-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

export default NotificationIcon;
