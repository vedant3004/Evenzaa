import { ShieldCheck, Users, Building2, Headset } from "lucide-react"

const items = [
  {
    icon: ShieldCheck,
    title: "Easy Event Planning",
    desc: "Plan and manage your events effortlessly in just a few minutes.",
  },
  {
    icon: Users,
    title: "Verified Vendor Network",
    desc: "5000+ trusted and verified vendors across multiple categories.",
  },
  {
    icon: Building2,
    title: "Premium Venues",
    desc: "Access to luxury venues perfect for weddings and corporate events.",
  },
  {
    icon: Headset,
    title: "24/7 Dedicated Support",
    desc: "Our support team is always available to assist you anytime.",
  },
]

export default function WhyChoose() {
  return (
    <section className="bg-gray-50 py-24 text-center">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold mb-4">
        Why Choose EventZaa?
      </h2>
      <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
        We simplify event planning by connecting you with trusted vendors and
        premium services.
      </p>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-4">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition">
                  <Icon size={32} />
                </div>
              </div>

              <h3 className="font-bold text-xl mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Trust Bar */}
      <div className="mt-16 flex justify-center gap-8 text-sm text-gray-600 flex-wrap">
        <span>✔ Trusted by 10,000+ Customers</span>
        <span>✔ Secure & Transparent</span>
        <span>✔ Hassle-Free Booking</span>
      </div>
    </section>
  )
}
