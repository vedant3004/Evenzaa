import Hero from "../components/Hero"
import Categories from "../components/Categories"
import WhyChoose from "../components/WhyChoose"
import FeaturedVendors from "../components/FeaturedVendors"
import HowItWorks from "../components/HowItWorks"
import Testimonials from "../components/Testimonials"
import CTA from "../components/CTA"
import AuthPopup from "../components/AuthPopup"

export default function Home() {
return (
<>
<AuthPopup/>
<Hero />
<Categories />
<WhyChoose />
<FeaturedVendors />
<HowItWorks />
<Testimonials />
<CTA/>
</>
)
}
