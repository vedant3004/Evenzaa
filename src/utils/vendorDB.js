const safeGet = (key) => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(key) || "[]")
}

export const getVendors = () => safeGet("evenzaa_vendors")

export const saveVendor = (vendor) => {
  if (typeof window === "undefined") return
  const list = safeGet("evenzaa_vendors")
  list.push(vendor)
  localStorage.setItem("evenzaa_vendors", JSON.stringify(list))
}

export const findVendor = (username, password) => {
  return getVendors().find(
    v => v.username === username && v.password === password
  )
}
