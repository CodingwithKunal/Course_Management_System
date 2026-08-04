import React from 'react'

const Instruct_data_cards = ({ title, value, icon: Icon, color = '#f59e0b' }) => {
  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl sm:p-5">
      <div className="flex items-start justify-between  ">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xl shadow-inner sm:h-14 sm:w-14"
          style={{
            color,
            borderColor: `${color}33`,
            backgroundColor: `${color}14`,
          }}
        >
          {Icon ? <Icon size={18} /> : <span className="text-sm font-semibold">•</span>}
        </div>
      </div>

      <div
        className="mt-5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export default Instruct_data_cards
