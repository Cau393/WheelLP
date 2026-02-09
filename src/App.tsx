import { useState } from 'react'
import './App.css'
import Registration from './pages/Registration.tsx'
import WheelGame from './pages/WheelGame.tsx'
import Reward from './pages/Reward.tsx'
import type { Prize } from './data/prizes'

interface FormData {
  name: string
  phone: string
  email: string
  course: string
  goal: string
  id?: string 
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'registration' | 'wheel' | 'reward'>('registration')
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', course: '', goal: '' })
  const [prizeData, setPrizeData] = useState<{ prize: Prize | null; code: string }>({
    prize: null,
    code: '',
  })

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setCurrentPage('wheel')
  }

  const handlePrizeWon = async (prize: Prize, code: string) => {
    setPrizeData({ prize, code })
    setCurrentPage('reward')

    try {
      if (!formData.id) {
        console.error("Missing User ID! Cannot save prize.")
        return
      }

      await fetch('/api/update-prize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id, 
          prize: prize.label,
          code: code,
          
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          course: formData.course,
          goal: formData.goal,
        }),
      })
      console.log("Prize saved successfully!")
    } catch (error) {
      console.error("Failed to save prize:", error)
    }
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = '5562981624758'

    const message = `Olá, meu código é ${prizeData.code}. Gostaria de saber mais informações sobre o Folia Pharma do CDPI e retirar meu prêmio!.`
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {currentPage === 'registration' && <Registration onSubmit={handleFormSubmit} />}
      {currentPage === 'wheel' && <WheelGame onPrizeWon={handlePrizeWon} />}
      {currentPage === 'reward' && (
        <Reward prizeCode={prizeData.code} onWhatsAppClick={handleWhatsAppClick} />
      )}
    </>
  )
}
