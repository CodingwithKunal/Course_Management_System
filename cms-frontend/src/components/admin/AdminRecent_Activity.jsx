import React, { useRef, useState } from 'react';
import { FiCheckCircle, FiUploadCloud, FiStar } from 'react-icons/fi';

// Relative timestamp formatter
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

// Activity badge & icon picker
const getActivityIcon = (type) => {
  switch (type) {
    case 'ENROLLMENT':
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
          <FiCheckCircle size={15} />
        </div>
      );
    case 'COURSE_SUBMITTED':
      return (
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
          <FiUploadCloud size={15} />
        </div>
      );
    case 'NEW_REVIEW':
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
          <FiStar size={15} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
          <FiCheckCircle size={15} />
        </div>
      );
  }
};


const RecentActivity = ({ activities = [], isLoading, isError }) => {
  const safeActivities = Array.isArray(activities) ? activities : [];

  const [isCleared, setIsCleared] = useState(() => {
    return localStorage.getItem("clearAllActivity") === 'true'
  });

  const visibleActivities = isCleared ? [] : safeActivities;

  const scrollContainerRef = useRef(null);
  const [scrolltoBottom, setScrolltoBottom] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const reachbottom = scrollTop + clientHeight >= scrollHeight - 10;

      setScrolltoBottom(reachbottom);
    }
  };

  const handleClearAll = () => {
    const confirmation = window.confirm("Are you sure you want to clear all ?");

    if (confirmation) {
      setIsCleared(true);
      setScrolltoBottom(false);
      localStorage.setItem("clearAllActivity", 'true')
    }
  };


  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full ">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-5">Recent Activity</h3>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3.5 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="py-6 text-center text-xs text-red-500 bg-red-50 rounded-xl">
            Failed to load recent activity.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && visibleActivities.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        )}

        {/* Activity List */}
        {!isLoading && !isError && visibleActivities.length > 0 && (

          <div className="space-y-4 max-h-95 overflow-y-auto" ref={scrollContainerRef} onScroll={handleScroll}>

            {visibleActivities.map((activity) => (
              <div key={activity.id || activity._id} className="flex items-start gap-3.5">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 leading-none">
                    {activity.title || 'Activity'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {activity.description || 'No description available.'}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        {/* Logic: Agar user bottom tak scroll kar chuka hai OR total items <= 6 hain */}
        {(scrolltoBottom || visibleActivities.length <= 6) && visibleActivities.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-600 w-full text-center cursor-pointer"
          >
            Clear All Activities
          </button>
        ) : (
          <p className="text-[11px] text-slate-400 text-center">
            Scroll down to view all activities
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;