import { HomeCard } from "./HomeCard.jsx";
import investImg from "../../assets/images/investCardImage.jpg";
import wantedImg from "../../assets/images/wantedCardImage.jpg";
import { useNavigate } from "react-router-dom";

const InvestWanted = () => {
  const navigate = useNavigate();

  const handleInvestClick = () => {
    navigate("/invest");
    console.log("Invest clicked");
  };

  const handleWantedClick = () => {
    navigate("/wanted");
    console.log("Wanted clicked");
  };

  return (
    <div className="flex flex-col md:flex-row w-full items-center justify-center gap-6 px-4">
      <div className="w-full md:w-1/2 h-full flex">
        <HomeCard
          imageSrc={investImg}
          title="Invest"
          description="Invest in fully legal Imarat projects. Our 'Ownerships' approach ensures fantastic returns with full risk mitigation."
          buttonText="INVEST NOW"
          onButtonClick={handleInvestClick}
        />
      </div>
      <div className="w-full md:w-1/2 h-full flex">
        <HomeCard
          imageSrc={wantedImg}
          title="Wanted"
          description="In just 3 clicks, activate a team of experts to find the properties you need."
          buttonText="WANTED"
          onButtonClick={handleWantedClick}
        />
      </div>
    </div>
  );
};

export default InvestWanted;
