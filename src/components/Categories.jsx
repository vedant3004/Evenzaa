import Link from "next/link"

const cats=["Weddings","Corporate","Birthday","Concerts","Conferences","Sports"]

export default function Categories(){
return(
<section className="py-20 bg-white text-center">
<h2 className="text-3xl font-bold mb-10">Popular Event Categories</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
{cats.map(c=>(
<Link key={c} href={`/categories/${c}`}>
<div className="bg-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
<h3 className="font-bold">{c}</h3>
<p className="text-gray-500">1000+ events</p>
</div>
</Link>
))}
</div>
</section>
)
}
