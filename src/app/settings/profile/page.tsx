'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/context/TranslationContext"

export default function ProfilePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [username, setUsername] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [gender, setGender] = useState("")
  const [profilePic, setProfilePic] = useState<string | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile")
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile)
      setUsername(parsed.username || "")
      setBirthdate(parsed.birthdate || "")
      setGender(parsed.gender || "")
    }
    const storedPic = localStorage.getItem("profilePic")
    if (storedPic) setProfilePic(storedPic)
  }, [])

  const handleSave = () => {
    localStorage.setItem(
      "profile",
      JSON.stringify({ username, birthdate, gender })
    )
    if (profilePic) localStorage.setItem("profilePic", profilePic)
    window.dispatchEvent(new Event("storage"))
    router.push("/settings")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfilePic(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold border-b border-neutral-700 pb-4">
          {t("editProfile")}
        </h1>

        <div className="flex flex-col items-center gap-4 relative">
          <div className="relative">
            <img
              src={profilePic || "/user-image.jpg"}
              alt={t("profilePhoto")}
              className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
            />
            <label
              htmlFor="profilePicInput"
              className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl cursor-pointer border-2 border-neutral-900 hover:bg-green-600"
            >
              +
            </label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400">
              {t("username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400">
              {t("birthdate")}
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400">
              {t("gender")}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 mt-1"
            >
              <option value="">{t("select")}</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
        >
          {t("save")}
        </button>
      </div>
    </div>
  )
}
