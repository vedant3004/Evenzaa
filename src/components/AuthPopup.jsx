"use client"

import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPopup() {
  const { open, setOpen, login, register, user } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  })

  // ================= REDIRECT AFTER LOGIN =================
  useEffect(() => {
    if (!user) return

    const redirect = localStorage.getItem("redirectAfterLogin")
    setOpen(false)

    if (redirect) {
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirect)
    }
  }, [user])

  if (!open) return null

  // ================= SUBMIT =================
  const submit = async () => {
    if (mode === "login") {
      if (!form.email || !form.password) {
        alert("Enter email & password")
        return
      }
      await login(form)
    } else {
      if (!form.name || !form.email || !form.password) {
        alert("Fill all fields")
        return
      }
      await register(form)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">

        <h2 className="text-2xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <div className="space-y-3">
          {mode === "register" && (
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="input"
            />
          )}

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="input"
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="input"
          />
        </div>

        <button
          onClick={submit}
          className="btn-primary w-full mt-4"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-center mt-3 text-sm">
          {mode === "login" ? (
            <>
              New here?
              <button
                onClick={() => setMode("register")}
                className="text-pink-500 ml-1"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have account?
              <button
                onClick={() => setMode("login")}
                className="text-pink-500 ml-1"
              >
                Login
              </button>
            </>
          )}
        </p>

        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  )
}
