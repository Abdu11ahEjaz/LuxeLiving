import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SellPageTop from "../components/UI/SellPageTop.jsx"
import SellProperty from "../components/UI/SellPageForm"

export const Sell = () => {
    const [searchParams] = useSearchParams();
    const purpose = searchParams.get("purpose") || "sell";
    
    return (
        <>
            <SellPageTop />
            <SellProperty key={purpose} initialPurpose={purpose} />
        </>
    )
}
