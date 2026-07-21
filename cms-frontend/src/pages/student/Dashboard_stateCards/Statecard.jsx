import React from 'react'

const Statecard = ({title,value, color,icon}) => {
  return (
    //creating card 
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md ${color} text-white w-1/6`}>
      <div className="text-2xl mb-2">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold">
        {value}
      </p>

    </div>
  )
}

export default Statecard
