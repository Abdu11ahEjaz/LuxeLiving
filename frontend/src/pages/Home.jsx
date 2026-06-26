import AreaGuides from "../components/UI/AreaGuides";
import { HeroSection } from "../components/UI/HeroSection";
import InvestWanted from "../components/UI/InvestWanted";
import TopAreas from "../components/UI/TopAreas";
import PropertiesForRent from "../components/UI/PropertiesForRent";
import PropertiesForSale from "../components/UI/PropertiesForSale";

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