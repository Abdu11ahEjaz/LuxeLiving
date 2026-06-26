import bgImage from "../../assets/images/Faisal-Mosque.jpg";
import { IoSearchSharp } from "react-icons/io5";

export const HeroSection = () => {
  return (
    <main
      className="pt-16 pb-4 md:pb-0 h-[calc(100vh-70px)] md:h-[calc(100vh-20px)] min-h-fit md:min-h-[calc(100vh-20px)] bg-cover bg-center bg-no-repeat bg-opacity-85 box-border flex items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-0 flex flex-col items-center justify-center gap-4 md:gap-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] [-webkit-text-stroke:0.3px_rgba(0,0,0,0.4)]">
          Buy or rent vetted properties at the most trusted online real estate portal
        </h1>
        
        <div className="flex gap-3 md:gap-4">
          <button className="px-4 py-2 sm:px-6 sm:py-2.5 text-center border-none rounded-md bg-white hover:opacity-80 hover:cursor-pointer hover:text-red-900 hover:underline hover:underline-offset-2 opacity-90 font-semibold text-sm sm:text-base md:text-lg text-gray-600">
            Buy
          </button>
          <button className="px-4 py-2 sm:px-6 sm:py-2.5 text-center border-none rounded-md bg-white hover:opacity-80 hover:cursor-pointer hover:text-red-900 hover:underline hover:underline-offset-2 opacity-90 font-semibold text-sm sm:text-base md:text-lg text-gray-600">
            Rent
          </button>
        </div>
        
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl h-11 sm:h-12 md:h-14 flex shadow-lg rounded-lg md:rounded-xl">
          <input 
            type="text" 
            className="flex-1 p-2 sm:p-3 border-none bg-white rounded-l-lg md:rounded-l-xl text-sm sm:text-base" 
            placeholder="Search by city or area" 
          />
          <button className="bg-red-500 w-10 sm:w-12 md:w-16 h-full border-none flex items-center justify-center rounded-r-lg md:rounded-r-xl hover:bg-red-600 transition-colors">
            <IoSearchSharp className="text-xl sm:text-2xl md:text-3xl text-white"/>
          </button>
        </div>
      </div>
    </main>
  );
};
