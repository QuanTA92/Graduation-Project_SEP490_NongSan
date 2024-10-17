import React from 'react'

const Filter = ({ icon, title}) => {
  return (
    <div className="flex items-center text-white bg-green-400 hover:bg-white hover:text-green-400 duration-200 ease-out gap-2 py-1 px-3 sm:px-4 rounded-full text-[14px] sm:text-[16px]">
      {icon}
      {title}
    </div>
  )
}

export default Filter
