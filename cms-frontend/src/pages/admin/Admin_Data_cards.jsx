import React from 'react'

const Admin_Data_cards = ({ title, value, isLoading, isError, prefix = "" }) => {
   return (
      <div className="bg-[#111622] border border-slate-800 p-5 rounded-xl text-white">
         <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
         </p>

         <div className="mt-2 text-2xl font-bold">
            {isLoading ? (
               <span className="inline-block w-16 h-7 bg-slate-700/60 rounded animate-pulse" />
            ) : isError ? (
               <span className="text-xs text-red-400 font-medium">Failed to load</span>
            ) : (
               <span>
                  {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
               </span>
            )}
         </div>
      </div>
   )
}

export default Admin_Data_cards
