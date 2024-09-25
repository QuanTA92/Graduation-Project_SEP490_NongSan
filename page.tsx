'use client';
import { BiSearch } from "react-icons/bi";
import { FaSwimmingPool, FaMountain, FaAccessibleIcon } from 'react-icons/fa';
import { GiCaveEntrance, GiCook, GiIgloo, GiBarn, GiHouse } from 'react-icons/gi';
import { MdOutlineHouseSiding, MdOutlineCabin } from 'react-icons/md';
import { AiOutlineMore } from 'react-icons/ai';

const Search = () => {
    return (
        <div className="
            border-[1px]
            w-full
            md:w-auto
            py-4
            rounded-full
            shadow-sm
            hover:shadow-md
            transition
            cursor-pointer">
           <div
           className="flex flex-row items-center justify-between">
                <div className="text-xs md:text-sm font-semibold px-4 md:px-6">
                    anywhere
                </div>
                <div className="hidden sm:block text-xs md:text-sm font-semibold px-4 md:px-6 border-x-[1px] flex-1 text-center">
                    any week
                </div>
                <div className="text-xs pl-4 pr-2 text-gray-600 flex flex-row items-center gap-2">
                    <div className="hidden sm:block">Add guest</div>
                    <div className="p-1 bg-rose-500 rounded-full text-white">
                        <BiSearch size={16} />
                    </div>
                </div>
            </div> 
        </div>
    )
}

const NavItems = () => {
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

  return (
    <div className="bg-white shadow-md py-2 z-50 sticky top-0">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto py-2">
          {navItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center cursor-pointer hover:text-gray-700">
              <div className="text-2xl text-black">{item.icon}</div> {/* Giảm kích thước xuống text-2xl */}
              <span className="mt-1 text-sm font-semibold text-black">{item.label}</span> {/* Giảm kích thước text */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const posts = [
    {
      title: 'Trại ớt cô Ba',
      description: 'Thưởng thức nông sản tuyệt vời tại Trại ớt cô Ba.',
      image: '/images/Nong-San-3.jpg',
    },
    {
      title: 'Vườn dâu chị Hai',
      description: 'Thưởng thức nông sản tuyệt vời tại Vườn dâu chị Hai.',
      image: '/images/Nong-San-4.jpg',
    },
    {
      title: 'Nông sản FPT Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại Nông sản FPT Farm.',
      image: '/images/nong-san-la-gi-1.jpg',
    },
    {
      title: 'Nông sản One Piece',
      description: 'Thưởng thức nông sản tuyệt vời tại Nông sản One Piece.',
      image: '/images/nong-san-la-gi-2.jpg',
    },
    {
      title: 'Vườn sầu riêng chú Tám',
      description: 'Thưởng thức nông sản tuyệt vời tại Vườn sầu riêng chú Tám.',
      image: '/images/nong-san-la-gi-3.jpg',
    },
    {
      title: 'The Tams Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại The Tams Farm.',
      image: '/images/nong-san-la-gi-4.jpg',
    },
    {
      title: 'F Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại F Farm.',
      image: '/images/nong-san-la-gi-5.jpg',
    },
    {
      title: 'Fruit Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại Fruit Farm.',
      image: '/images/nong-san-la-gi-7.jpg',
    },
    {
      title: 'Trại ớt cô Ba',
      description: 'Thưởng thức nông sản tuyệt vời tại Trại ớt cô Ba.',
      image: '/images/Nong-San-3.jpg',
    },
    {
      title: 'Vườn dâu chị Hai',
      description: 'Thưởng thức nông sản tuyệt vời tại Vườn dâu chị Hai.',
      image: '/images/Nong-San-4.jpg',
    },
    {
      title: 'Nông sản FPT Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại Nông sản FPT Farm.',
      image: '/images/nong-san-la-gi-1.jpg',
    },
    {
      title: 'Nông sản One Piece',
      description: 'Thưởng thức nông sản tuyệt vời tại Nông sản One Piece.',
      image: '/images/nong-san-la-gi-2.jpg',
    },
    {
      title: 'Vườn sầu riêng chú Tám',
      description: 'Thưởng thức nông sản tuyệt vời tại Vườn sầu riêng chú Tám.',
      image: '/images/nong-san-la-gi-3.jpg',
    },
    {
      title: 'The Tams Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại The Tams Farm.',
      image: '/images/nong-san-la-gi-4.jpg',
    },
    {
      title: 'F Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại F Farm.',
      image: '/images/nong-san-la-gi-5.jpg',
    },
    {
      title: 'Fruit Farm',
      description: 'Thưởng thức nông sản tuyệt vời tại Fruit Farm.',
      image: '/images/nong-san-la-gi-7.jpg',
    },
  ];

  return (
    <div>
      {/* Thanh điều hướng và phần tìm kiếm */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto py-2 flex items-center justify-between">
          <img src="/logo.png" alt="Logo" className="h-10"/>
          <Search />
          <div className="font-semibold text-black">FIND</div>
        </div>
      </div>

      {/* Khoảng trống để tránh phần nội dung bị đè bởi thanh tìm kiếm */}
      <div className="mt-20"></div>

      {/* NavItems */}
      <NavItems />

      {/* Lưới hiển thị bài viết */}
      <section className="py-12">
        <h1 className="text-4xl font-bold text-center mb-6">The Tams</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={post.image}
                alt={post.title}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
