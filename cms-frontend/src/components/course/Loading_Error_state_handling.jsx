import React from 'react'

 export const Loading_Error_state_handling = ({ isLoading, isError }) => {
  if (isError) {
    return (
      <section className="flex justify-center items-center py-20 text-red-400 min-h-[50vh]">
        <div className="text-center bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">
          <p className="font-medium text-lg">Failed to load courses. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <main className="px-10 mx-auto flex gap-8 py-8 animate-pulse">
        {/* Left Sidebar Skeleton (Filteration) */}
        <section className="mt-18 hidden md:block w-64 shrink-0">
          <div className="h-8 bg-gray-800 rounded-lg w-3/4 mb-6"></div>
          <div className="space-y-10">
            <div className="h-10 bg-gray-800 rounded-xl w-full"></div>
            <div className="h-10 bg-gray-800 rounded-xl w-full"></div>
            <div className="h-10 bg-gray-800 rounded-xl w-full"></div>
          </div>
        </section>

        {/* Right Main Content Skeleton */}
        <section className="flex-1">
          {/* Header Skeleton */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <div className="h-8 bg-gray-800 rounded-xl w-64"></div>
            <div className="h-4 bg-gray-800 rounded-lg w-80"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="h-12 bg-gray-800 rounded-xl w-full max-w-2xl"></div>
          </div>

          {/* Course Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="border border-gray-800 bg-gray-900/50 p-5 rounded-xl flex flex-col justify-between h-48"
              >
                <div className="space-y-3">
                  {/* Title Skeleton */}
                  <div className="h-6 bg-gray-800 rounded-md w-3/4"></div>
                  {/* Category Skeleton */}
                  <div className="h-4 bg-gray-800 rounded-md w-1/2"></div>
                  {/* Level Skeleton */}
                  <div className="h-4 bg-gray-800 rounded-md w-1/3"></div>
                </div>

                {/* View Details Button Skeleton */}
                <div className="mt-4">
                  <div className="h-9 bg-gray-800 rounded-2xl w-28"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return null;
};