'use client';
import { BiSearch } from "react-icons/bi";

const Search = () => {
    return (
        <div className="
            border-[1px]
            w-full
            md:w-auto
            py-1    /* Giảm padding dọc */
            rounded-full
            shadow-sm
            hover:shadow-md
            transition
            cursor-pointer">
            <div
            className="flex flex-row items-center justify-between">
                <div className="text-xs md:text-sm font-semibold px-4 md:px-6">  {/* Giảm font size và padding */}
                    anywhere
                </div>
                <div className="hidden sm:block text-xs md:text-sm font-semibold px-4 md:px-6 border-x-[1px] flex-1 text-center">  {/* Giảm font size và padding */}
                    any week
                </div>
                <div className="text-xs pl-4 pr-2 text-gray-600 flex flex-row items-center gap-2">  {/* Giảm font size, padding, và khoảng cách giữa các mục */}
                    <div className="hidden sm:block">Add guest</div>
                    <div className="p-1 bg-rose-500 rounded-full text-white">  {/* Giảm padding xung quanh biểu tượng */}
                        <BiSearch size={16} />  {/* Giảm kích thước biểu tượng */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
