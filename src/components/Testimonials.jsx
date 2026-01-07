import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Bride",
    review:
      "EventZaa made my wedding planning completely stress-free. The vendors were amazing!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Corporate Client",
    review:
      "Excellent service and professional vendors. Our corporate event was a big success.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "Event Host",
    review:
      "Very smooth booking experience and great customer support throughout.",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white text-center">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold mb-4">
        What Our Clients Say
      </h2>
      <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
        Hear from people who trusted EventZaa for their special occasions.
      </p>

      {/* Testimonials */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
          >
            {/* Stars */}
            <div className="flex gap-1 text-yellow-500 mb-4">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={18} fill="currentColor" />
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-600 italic mb-6 leading-relaxed">
              “{t.review}”
            </p>

            {/* User */}
            <div>
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
