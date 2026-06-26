import React from "react";
import bgImage from "../../assets/images/ground.jpg";
import mapImage from "../../assets/images/map.jpg";
import { IoSearchSharp } from "react-icons/io5";
import CityDropdown from "./CityDropdown.jsx";

const AreaGuides = () => {
    return (
        <section
            className="w-full bg-cover bg-center"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="max-w-7xl mx-auto my-1.5 px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-7">

                    {/* LEFT COLUMN */}
                    <div className="mb-13 mx-4 sm:mx-8 md:mx-20" >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                            Area Guides
                        </h2>

                        <p className="text-sm sm:text-base text-gray-600 max-w-md mb-4">
                            View schools, health services, parks, security index and other
                            details of any area
                        </p>

                        <div className="flex items-center bg-white border rounded-lg px-2 py-2 w-full sm:max-w-sm md:max-w-md shadow-sm">

                            <button className="py-2 px-2 flex-shrink-0 h-[100%] place-items-center border-none">
                                <IoSearchSharp className="text-xl sm:text-2xl md:text-3xl text-black" />
                            </button>

                            <input
                                type="text"
                                placeholder="Search area"
                                className="flex-1 outline-none text-sm sm:text-base text-gray-700 min-w-0"
                            />
                            <CityDropdown />
                        </div>
                    </div>

                    {/* RIGHT COLUMN (MAP IMAGE) */}
                    <div className="hidden lg:flex justify-center mb-10">
                        <img
                            src= {mapImage}
                            alt="Map"
                            className="max-w-md w-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AreaGuides;
