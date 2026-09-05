
import HeroSection from "./components/HeroSection";
import AboutJourney from "./components/Aboutjourney";
import FacultySection from "./components/FacultySection";
import CoursesSection from "./components/CoursesSection";
import SchoolHero from "./components/Whychose";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import PrincipalMessageSection from "./about/PrincipalMessageSection";


export default function Home() {
  return (
 <>
 <HeroSection/>
 <AboutJourney/>

 <SchoolHero/>
 
 <CoursesSection/>
 <PrincipalMessageSection/>
 <TestimonialsSection/>
 <FAQSection/>

 </>
  );
}
