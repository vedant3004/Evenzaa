"use client"
import vendors from "../../../data/vendors"
import { useParams,useRouter } from "next/navigation"

export default function CategoryPage(){
const {cat} = useParams()
const router = useRouter()

const list = vendors.filter(v => v.category.toLowerCase() === cat.toLowerCase())

return(
<div className="pt-28 max-w-7xl mx-auto px-4">
<h1 className="text-3xl font-bold mb-8">{cat} Vendors</h1>

<div className="grid md:grid-cols-3 gap-6">
{list.map(v=>(
<div key={v.id} className="bg-white p-6 rounded-xl shadow">
<img src={v.image} className="h-48 w-full object-cover rounded mb-4"/>
<h3 className="font-bold">{v.name}</h3>
<p>{v.desc}</p>
<button onClick={()=>router.push(`/vendors/${v.slug}`)} className="btn-primary w-full mt-4">
View Details
</button>
</div>
))}
</div>
</div>
)
}
