import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import footerImg from "../assets/images/Invest Page/Invest Page footerImg.png";

const HeroSection = () => {
  return (
    <section className="relative bg-background overflow-hidden mt-10 pb-0">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-22">
        {/* Increased vertical padding for height */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 ml-10">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-left">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-600 text-foreground leading-tight">
              Invest in IMARAT Projects
            </h1>

            <p className="mt-8 text-muted-foreground text-lg md:text-xl leading-relaxed">
              Invest in fully legal IMARAT projects. Our "Ownership, Approval,
              Demand & Delivery" approach ensures fantastic returns with full
              risk mitigation.
            </p>

            <button className="mt-10 bg-gray-600 text-white px-10 py-4 rounded-md font-semibold text-base uppercase tracking-wider hover:opacity-90 transition-opacity">
              View All Projects
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg">
              <img
                src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772265566/HeroImg-InvestPage_vsvklv.webp"
                alt="Invest Page Hero Img"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const oaddItems = [
  {
    title: "Ownership",
    description:
      "IMARAT, a real estate company, prioritizes verifying proper land acquisition to mitigate legal concerns. Through rigorous due diligence, they ensure industry-leading compliance.",
    color: "teal",
    align: "right",
    icon: "home",
  },
  {
    title: "Approvals",
    description:
      "IMARAT emphasizes obtaining necessary approvals to address legal considerations in real estate transactions. Their meticulous due diligence and compliance guarantee secure properties for clients.",
    color: "teal",
    align: "left",
    icon: "document",
  },
  {
    title: "Demand",
    description:
      "We excel in commercial projects by hosting a diverse range of brands for Pakistan's growing population. Through market analysis and expertise in real estate development, we create iconic destinations.",
    color: "coral",
    align: "right",
    icon: "chart",
  },
  {
    title: "Delivery",
    description:
      "With a focus on outstanding commercial projects, we engage leasing teams to attract the best local and international brands. Our experience and strategic planning ensure desirable and enduring developments.",
    color: "dark-green",
    align: "left",
    icon: "construction",
  },
];

const OADDSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-gray-600 text-muted-foreground text-sm mb-2">
            Our criteria to choose best projects to invest
          </p>
          <h2 className="text-gray-600 text-3xl md:text-4xl font-bold text-foreground mb-2">
            OADD
          </h2>
          <p className="text-gray-600 text-muted-foreground text-sm">
            Ownership - Approvals - Demand - Delivery
          </p>
        </div>

        <div className="w-full">
          <img
            src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772276484/desktop_hfvtek.png"
            alt="OADD - Ownership Approvals Demand Delivery"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

const whyUsPoints = [
  "Ownership",
  "Approvals",
  "Ideal Locations",
  "Delivery",
  "Maximum Appreciation",
];

const WhyUsSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
          {/* Left Content - 50% width */}
          <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
            <p className="text-red-500 text-accent text-md sm:text-xl font-bold uppercase tracking-wider ">
              Why us?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-600 text-foreground">
              How we are different ...
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-justify text-gray-600">
              At Graana, we believe in delivering the best of the best and
              raising the bar to the highest level like never before. We make
              sure that we don't compromise on anything and deliver what we have
              promised. Graana.com, being a subsidiary of IMARAT Group of
              Companies, has always focused on providing quality-driven services
              aiming at the greater success of the clients and offers guaranteed
              excellence and values in its projects.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed text-gray-600 text-justify">
              Choose wisely, choose Graana.com because we deliver nothing but
              the best services. Let us care for you to get the best outcome.
            </p>
          </div>

          {/* Right Content with Background - 50% width */}
          <div className="rounded-4xl w-full md:w-1/2 relative bg-gray-200 min-h-[400px] flex items-center">
            {/* Window background image - positioned at top right */}
            <img
              src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772443801/WindowSvg_wqag2j.png"
              alt="Window Background"
              className="absolute top-0 right-0 w-48 h-48 sm:w-48 sm:h-50 md:w-45 md:h-50 object-contain"
            />

            {/* Overlay images - positioned at bottom right */}
            <img
              src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772443801/books_gikivi.png"
              alt="Book"
              className="absolute bottom-0 right-18 w-30 h-30 sm:w-35 sm:h-25 z-10"
            />
            <img
              src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772443801/Plant_xnpa9h.png"
              alt="Plant"
              className="absolute bottom-0 right-4 w-40 h-40 sm:w-35 sm:h-48 z-0"
            />

            {/* Checklist content */}
            <div className="w-full space-y-4 p-6 sm:p-8 relative z-10">
              {whyUsPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772276902/checkIcon_rwnlb0.png"
                    alt="Check"
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                  />
                  <span className="font-semibold text-gray-600 text-lg sm:text-2xl text-foreground">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const projects = [
  {
    title: "Mall of IMARAT",
    description:
      "Nestled in the hubbub of IMARAT Downtown, the Mall of IMARAT appears as a vision to visitors and onlookers, with its elegant mid-century Arabian architecture and intricate design details. Its excellent location enhances this exuberant retail and leisure destination and allows it to thrive in all its aesthetic glory.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772448339/Mall_of_imarat_qeunbf.webp",
  },
  {
    title: "Grand Bazar",
    description:
      "Blending the classic with the contemporary, the Grand Bazar is a lively marketplace that offers the city's residents and tourists an enthralling experience of shopping, entertainment, and dining.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772448745/Grand_bazar_mpzeb6.webp",
  },
  {
    title: "IMARAT Residences",
    description:
      "A premium residential project offering modern living spaces with world-class amenities, designed for comfort and luxury in the heart of the city.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772448824/Imarat_residencies_rio74u.webp",
  },
  {
    title: "IMARAT Downtown",
    description:
      "A mixed-use development combining retail, entertainment, and hospitality, creating a vibrant urban destination that sets new standards in city living.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772449188/Imarat_downtwn_xljgms.webp",
  },
  {
    title: "Golf Floras",
    description:
      "An exclusive gated community featuring lush green landscapes, a golf course, and premium villas designed for those who seek an elevated lifestyle.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772449229/Golf_floras_2_cb623t.webp",
  },
  {
    title: "IMARAT Business District",
    description:
      "A state-of-the-art commercial hub offering premium office spaces and corporate facilities, strategically located for maximum business potential.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772449425/Imarat_Builders_Mall_qxnm1s.webp",
  },
  {
    title: "Amazon Mall",
    description:
      "Amazon Mall is the first outlet concept mall in Pakistan and a home to the most premium fashion brands. Designed on a rainforest theme, the mall aims to be the ultimate value retail destination where shoppers can avail extensive deals and discounts on all the brands under one roof.",
    image:
      "https://res.cloudinary.com/dnrpwpdqv/image/upload/f_auto,q_90,w_1200/v1772449541/Amazon_xbzavg.webp",
  },
];

const ProjectsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const project = projects[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="py-12 sm:py-16 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl text-gray-600 md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Our Projects
          </h2>
          <p className="text-muted-foreground text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Explore curated real estate projects for lucrative investments.
            Discover diverse opportunities for growth and profitability, from
            residential to commercial ventures. Let's unlock your investment
            success together.
          </p>
        </div>

        <div className="relative">
          <div className="bg-secondary rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6 sm:p-8 md:p-12 w-auto h-[300px] flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 text-gray-600">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-gray-600">
                  {project.description}
                </p>
                <div>
                  <button className="bg-primary text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wider hover:opacity-90 transition-opacity bg-gray-600 text-white">
                    Invest Now
                  </button>
                </div>
              </div>
              <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 md:p-6">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-35 sm:h-50 md:h-50 object-contain"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-80 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs sm:text-sm text-gray-600">
                      Image Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 ">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors bg-gray-500 ${
                  index === currentIndex ? "bg-coral" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <button
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-coral/20 text-coral flex items-center justify-center hover:bg-coral/30 transition-colors"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-5 h-5 sm:w-10 sm:h-13 text-red-600" />
          </button>
          <button
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-coral text-coral-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            onClick={handleNext}
          >
            <ChevronRight className="w-5 h-5 sm:w-10 sm:h-13 text-red-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

const CityBanner = () => {
  return (
    <section className="w-full h-40 sm:h-64 md:h-96 overflow-hidden bg-muted flex items-center justify-center">
      <div className="w-full">
        <img
          // src="https://res.cloudinary.com/dnrpwpdqv/image/upload/v1772449632/Invest_Page_footerImg_lnixxu.png"
          src={footerImg}
          alt="City Panoramic Image Placeholder"
          className="w-full h-64 object-cover object-center  "
        />
      </div>
    </section>
  );
};

// import TopAreas from "../components/UI/TopAreas";

export const Invest = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="max-w-6xl mx-auto px-6 mt-0">
        <hr className="border-border" />
      </div>
      <OADDSection />
      <WhyUsSection />
      <ProjectsSection />
      {/* <TopAreas /> NEW: Area property carousels */}
      <CityBanner />
    </div>
  );
};


// const InvestPage = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <HeroSection />
//       <div className="max-w-6xl mx-auto px-6">
//         <hr className="border-border" />
//       </div>
//       <OADDSection />
//       <WhyUsSection />
//       <ProjectsSection />
//       <CityBanner />
//     </div>
//   );
// };

// export default InvestPage;
