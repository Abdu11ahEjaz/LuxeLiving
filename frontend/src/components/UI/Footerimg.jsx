// import React from 'react'

// const Footerimg = () => {
//     return (
//         <div><img className="w-full h-full object-fill " src="https://www.graana.com/home-page-images/footer.svg" alt="footerimg" /></div>
//     )
// }

// export default Footerimg


import React from 'react';
import footerImg from "../../assets/images/footer.png";

const Footerimg = () => {
  return (
    <div className="
      w-full 
      overflow-hidden 
      bg-white
      h-[80px]        /* mobile */
      sm:h-[100px]    /* small screens */
      md:h-[120px]    /* tablets */
      lg:h-[140px]    /* desktop */
    ">
      <img
        src={footerImg}
        alt="footerimg"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default Footerimg;

