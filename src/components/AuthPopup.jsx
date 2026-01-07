"use client"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { saveUser } from "../utils/userDB"

export default function AuthPopup() {
  const { open, setOpen, login } = useAuth()
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({})

  if (!open) return null

  // ================= REGISTER =================
  const register = () => {
    if (!form.email || !form.password || !form.name)
      return alert("Fill all fields")

    const ok = saveUser(form)

    if (!ok)
      return alert("User already registered. Please login.")

    login(form) // auto login after register
  }

  // ================= LOGIN =================
  const doLogin = () => {
    if (!form.email || !form.password)
      return alert("Enter email & password")

    login(form)
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
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          )}

          <input
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input"
          />

          <input
            placeholder="Password"
            type="password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="input"
          />

        </div>

        <button
          onClick={mode === "login" ? doLogin : register}
          className="btn-primary w-full mt-4"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-center mt-3 text-sm">
          {mode === "login" ? (
            <>New here?
              <button
                onClick={() => setMode("register")}
                className="text-pink-500 ml-1"
              >
                Register
              </button>
            </>
          ) : (
            <>Already have account?
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
