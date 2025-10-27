'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from '@/context/TranslationContext'

type SupportedLang = 'es' | 'en' | 'fr' | 'zh' | 'zu'

export default function SettingsPage() {
  const router = useRouter()
  const { lang, setLang, t } = useTranslation()
  const [language, setLanguage] = useState<SupportedLang>(lang)
  const [notifications, setNotifications] = useState({ email: true, push: false })
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications))
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=(\w+)/)
    if (cookieMatch) setLang(cookieMatch[1] as SupportedLang)
  }, [setLang])

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    setLanguage(lang)
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=${60*60*24*365}`
  }, [lang])

  const handleEmailToggle = async () => {
    const newState = !notifications.email
    setNotifications({ ...notifications, email: newState })
    if (newState) setShowEmailInput(true)
  }

  const handlePushToggle = () => {
    const newState = !notifications.push
    setNotifications({ ...notifications, push: newState })
    setToastMessage(newState ? t('pushEnabled') : t('pushDisabled'))
    setTimeout(() => setToastMessage(""), 3000)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLang
    setLanguage(newLang)
    setLang(newLang)
    const currentPath = window.location.pathname.replace(/^\/(es|en|fr|zh|zu)/, "")
    router.push(`/settings`)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-3xl font-bold border-b border-neutral-700 pb-4">{t('settings')}</h1>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('account')}</h2>
          <button
            onClick={() => router.push("/settings/profile")}
            className="w-full bg-neutral-800 p-4 rounded-lg flex justify-between hover:bg-neutral-700 transition"
          >
            <span>{t('profile')}</span>
            <span className="text-neutral-400">›</span>
          </button>
          <div className="bg-neutral-800 p-4 rounded-lg flex justify-between">
            <span>{t('plan')}</span>
            <span className="text-green-400 font-medium">{t('premium')}</span>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('notifications')}</h2>

          <div className="bg-neutral-800 p-4 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span>{t('email')}</span>
              <button
                onClick={handleEmailToggle}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${notifications.email ? "bg-green-500" : "bg-neutral-600"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${notifications.email ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            {showEmailInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="email"
                  placeholder={t('yourEmail')}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white"
                />
                <button
                  onClick={async () => {
                    if (!userEmail) return alert(t('enterValidEmail'))
                    localStorage.setItem("userEmail", userEmail)
                    setShowEmailInput(false)
                    try {
                      const res = await fetch("/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail })
                      })
                      const data = await res.json()
                      if (data.success) alert(`${t('welcomeMessage')} ${userEmail}`)
                      else alert(`${t('emailSendError')}: ${data.error}`)
                    } catch {
                      alert(t('emailSendError'))
                    }
                  }}
                  className="bg-green-500 px-4 rounded-lg"
                >
                  {t('send')}
                </button>
              </div>
            )}
          </div>

          <div className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center">
            <span>{t('push')}</span>
            <button
              onClick={handlePushToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${notifications.push ? "bg-green-500" : "bg-neutral-600"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${notifications.push ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </section>

        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-md shadow-lg transition-opacity">
            {toastMessage}
          </div>
        )}

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('language')}</h2>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="es">{t('spanish')}</option>
              <option value="en">{t('english')}</option>
              <option value="fr">{t('french')}</option>
              <option value="zh">{t('chinese')}</option>
              <option value="zu">{t('zulu')}</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  )
}
