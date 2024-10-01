// components/navbar/NavItems.tsx
'use client';

import { FaSwimmingPool, FaMountain, FaAccessibleIcon } from 'react-icons/fa';
import { GiCaveEntrance, GiCook, GiIgloo, GiBarn, GiHouse } from 'react-icons/gi';
import { MdOutlineHouseSiding, MdOutlineCabin } from 'react-icons/md';
import { AiOutlineMore } from 'react-icons/ai';



const navItems = [
    { icon: <FaMountain size={24} />, label: 'Ớt' },
    { icon: <FaSwimmingPool size={24} />, label: 'Tiêu' },
    { icon: <GiCaveEntrance size={24} />, label: 'Salad' },
    { icon: <FaAccessibleIcon size={24} />, label: 'Rau' },
    { icon: <GiCook size={24} />, label: 'Sầu riêng' },
    { icon: <MdOutlineCabin size={24} />, label: 'Chanh' },
    { icon: <GiIgloo size={24} />, label: 'Táo' },
    { icon: <MdOutlineHouseSiding size={24} />, label: 'Vừng' },
    { icon: <GiHouse size={24} />, label: 'XXX' },
    { icon: <GiBarn size={24} />, label: 'XXX' },
    { icon: <AiOutlineMore size={24} />, label: 'XXX' },
];


export default function NavItems() {
  return (
    <div className="bg-white shadow-md py-4">
  <div className="container mx-auto px-4">
    <div className="flex space-x-6 overflow-x-auto py-4">
      {navItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center text-center cursor-pointer hover:text-black">
          {/* Chuyển màu biểu tượng sang màu đen */}
          <div className="text-4xl text-black">{item.icon}</div>
          {/* Chuyển màu văn bản sang màu đen */}
          <span className="mt-2 text-lg font-semibold text-black">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
</div>


  );
}
