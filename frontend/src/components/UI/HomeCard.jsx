// import Button from "../UI/Button.jsx";

// export const HomeCard = ({ imageSrc, title, description,buttonText,onButtonClick }) => {
//   return (
//     <div className="min-h-[300px] md:min-h-[200px] flex justify-center flex-col  place-items-center m-5">
//       <img src={imageSrc} alt={title} className="m-5 min-w-45 max-h-40" />
//       <h2 className="text-2xl font-bold p-1 m-2">{title}</h2>
//       <p className="text-center font-light text-[16px] ">{description}</p>
//       <Button width={'auto'} height={'auto'} fontSize={'18px'} padding={'10px'} onClick={onButtonClick}>
//         {buttonText}
//       </Button>
//     </div>
//   );
// }

import Button from "../UI/Button.jsx";

export const HomeCard = ({
  imageSrc,
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col justify-between items-center text-center p-6 bg-white rounded-lg shadow-md w-full h-full">
      {/* Image */}
      <img src={imageSrc} alt={title} className="w-40 h-40 object-cover mb-4" />

      {/* Text */}
      <div className="flex flex-col gap-2 flex-grow justify-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 text-[17px] font-light leading-relaxed max-w-[90%] mx-auto">
          {description}
        </p>
      </div>

      {/* Button */}
      <Button
        width="w-auto"
        height="h-auto"
        fontSize="text-[18px]"
        padding="px-4 py-2"
        onClick={onButtonClick}
      >{buttonText}</Button>
      
    </div>
  );
};
