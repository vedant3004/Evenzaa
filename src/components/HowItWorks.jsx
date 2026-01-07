import { Search, Users, CalendarCheck } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Choose Your Event",
    desc: "Select the type of event you want to organize.",
  },
  {
    icon: Users,
    title: "Browse Vendors",
    desc: "Compare verified vendors and services easily.",
  },
  {
    icon: CalendarCheck,
    title: "Book & Celebrate",
    desc: "Confirm bookings and enjoy a stress-free event.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-24 text-center">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold mb-4">
        How It Works
      </h2>
      <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
        Organizing your event is simple, fast and hassle-free with EventZaa.
      </p>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={i}
              className="relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Step Number */}
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pink-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
                {i + 1}
              </span>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <Icon size={32} />
                </div>
              </div>

              <h3 className="font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
