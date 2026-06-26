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
      h-[140px]       /* mobile */
      sm:h-[170px]    /* small screens */
      md:h-[200px]    /* tablets */
      lg:h-[220px]    /* desktop */
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

