export const getUsers = () =>
  JSON.parse(localStorage.getItem("eventzaa_users") || "[]")

export const saveUser = (user) => {
  const users = getUsers()

  // duplicate email block (NO CRASH)
  const exists = users.find(u => u.email === user.email)

  if (exists) {
    return false   // ❗ return false instead of throwing error
  }

  users.push({
    id: Date.now(),
    ...user,
    createdAt: new Date().toLocaleString()
  })

  localStorage.setItem("eventzaa_users", JSON.stringify(users))
  return true
}

export const findUser = (email, password) => {
  return getUsers().find(u => u.email === email && u.password === password)
}
