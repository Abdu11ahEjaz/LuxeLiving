import { NavLink } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";

export const Footers = () => {
  return (
    <div className="block mt-10">
      <footer className=" w-full md:h-[170px] h-auto  bg-gray-200 pt-2 text-black text-center mt-10 flex flex-col md:flex-row justify-around gap-6 md:gap-[20px] mb-6 ">
      
      <div className="hidden md:flex flex-col">
        <h3 className="font-bold text-[20px] mb-1">About Us</h3>
        <ul className="text-[14px]">
          <li><NavLink to="/our-story" className="hover:underline">Our Story</NavLink></li>
          <li><NavLink to="/blog" className="hover:underline">Our Blog</NavLink></li>
          <li><NavLink to="/careers" className="hover:underline">Careers</NavLink></li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-[20px] mb-1">Quick Links</h3>
        <ul className="text-[14px]">
          <li><NavLink to="/projects/rawalpindi" className="hover:underline">Projects in Rawalpindi</NavLink></li>
          <li><NavLink to="/projects/islamabad" className="hover:underline">Projects in Islamabad</NavLink></li>
          <li><NavLink to="/projects/lahore" className="hover:underline">Projects in Lahore</NavLink></li>
          <li><NavLink to="/projects/peshawar" className="hover:underline">Projects in Peshawar</NavLink></li>
          <li><NavLink to="/projects/karachi" className="hover:underline">Projects in Karachi</NavLink></li>
        </ul>
      </div>

      <div className="hidden md:flex flex-col">
        <h3 className="font-bold text-[20px] mb-1">Contact Us</h3>
        <div className="text-[14px] flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <MdOutlineEmail /> <span>abdullahraj982@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <CiPhone /> <span>0300-5115153</span>
          </div>
        </div>
      </div>

      <div className=" p-2 text-black"  >
        <h3 className="font-bold text-[20px] mb-1">Follow Us</h3>
        <div className="flex justify-center gap-3 mt-1">
          <a href="https://wa.me/923005115153" target="_blank" rel="noreferrer">
            <IoLogoWhatsapp className="w-6 h-6 hover:text-green-600" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            <FaInstagram className="w-6 h-6 hover:text-pink-500" />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noreferrer">
            <CiFacebook className="w-6 h-6 hover:text-blue-500" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            <FiGithub className="w-6 h-6 hover:text-gray-800" />
          </a>
        </div>
      </div>
     </footer>
    </div>
  );
};
