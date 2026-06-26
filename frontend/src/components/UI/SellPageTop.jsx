import React from "react";

const SellPageTop = () => {
  return (
    <>
      <div className="bg-white pt-10 md:pt-28 mt-10 md:mt-20 lg:pt-28">
        <div className="max-w-6xl mx-auto mt-2 md:mt-10 mb-2 md:mb-10 px-5">
          <div className="bg-[#E85A50] rounded-2xl relative overflow-visible h-auto md:h-[220px] lg:h-[265px]">

            {/* Left Content */}
            <div className="px-4 md:px-12 py-4 md:py-16 lg:max-w-lg text-white">
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4">
                Upload your property details
              </h1>
              <p className="text-sm md:text-lg lg:text-xl opacity-90">
                Get the best value for your property in a few steps.
              </p>
            </div>

            {/* Right Image */}
            <div className="hidden md:block absolute -right-5 -bottom-2.5">
              <img
                src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772195825/Adobe_Express_-_file_jmjyr2.png"
                alt="Building"
                className="h-[380px] md:h-[350px] lg:h-[400px] object-contain"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default SellPageTop;
