import AreaGuides from "../components/UI/AreaGuides.jsx";
import { HeroSection } from "../components/UI/HeroSection.jsx";
import InvestWanted from "../components/UI/InvestWanted.jsx";
import TopAreas from "../components/UI/TopAreas.jsx";
import PropertiesForRent from "../components/UI/PropertiesForRent.jsx";
import PropertiesForSale from "../components/UI/PropertiesForSale.jsx";

export const Home = () => {
    return (
        <>
            <HeroSection />
            <InvestWanted />
            <AreaGuides />
            <TopAreas />
            <PropertiesForRent />
            <PropertiesForSale />
        </>
    )
};