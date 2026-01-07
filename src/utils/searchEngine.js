import vendors from "../data/vendors"

export function getSuggestions(query, city="") {
  if(!query) return []

  query = query.toLowerCase()

  return vendors.filter(v =>
    (v.name.toLowerCase().includes(query) ||
     v.service.toLowerCase().includes(query) ||
     v.category?.toLowerCase().includes(query) ||
     v.keywords?.some(k=>k.includes(query))) &&
    (city ? v.location.toLowerCase().includes(city.toLowerCase()) : true)
  )
}
