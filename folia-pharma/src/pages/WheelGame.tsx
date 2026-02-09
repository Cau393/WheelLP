import { useState } from 'react'
import PrizeWheel from '../components/PrizeWheel.tsx'
import PrizeModal from '../components/PrizeModal.tsx'
import type { Prize } from '../data/prizes'
import { WHEEL_SEGMENTS } from '../data/prizes'
import './Page2.css'

type WheelGameProps = Readonly<{
  onPrizeWon: (prize: Prize, code: string) => void
}>

export default function WheelGame({ onPrizeWon }: WheelGameProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [wonPrize, setWonPrize] = useState<Prize | null>(null)
  const [prizeCode, setPrizeCode] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [rotation, setRotation] = useState(0)

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

  const handleSpin = () => {
  if (isSpinning) return

  // 1. Math Logic (Probability)
  const rand = Math.random() * 100
  let winningType: 'rare' | 'medium' | 'common'

  if (rand < 10) winningType = 'rare'      // 10%
  else if (rand < 40) winningType = 'medium' // 30%
  else winningType = 'common'              // 60%

  // 2. Find valid segments for this type
  const validIndices = WHEEL_SEGMENTS
    .map((seg, i) => (seg.type === winningType ? i : -1))
    .filter(i => i !== -1)

  // 3. Pick a random specific segment index
  const winningIndex = validIndices[Math.floor(Math.random() * validIndices.length)]
  const prize = WHEEL_SEGMENTS[winningIndex]

  // 4. Calculate Rotation
  // We want the winning segment to land at 0deg (top).
  // Formula: 360 - (index * 30 + 15)
  // +15 accounts for the text being in the middle of the slice
  const segmentAngle = 360 / WHEEL_SEGMENTS.length // 30
  const offset = segmentAngle / 2 // 15
  
  // 5 full spins (1800) + the specific angle to land
  const targetRotation = 360 * 5 + (360 - (winningIndex * segmentAngle + offset))

  setRotation(targetRotation)
  setIsSpinning(true)
  setWonPrize(null)
  setShowModal(false)

  setTimeout(() => {
    setWonPrize(prize)
    setPrizeCode(generateCode())
    setIsSpinning(false)
    setShowModal(true)
  }, 4000)
}

  const handleCloseModal = () => {
    setShowModal(false)
    if (wonPrize) {
      onPrizeWon(wonPrize, prizeCode)
    }
  }

  return (
    <div className="page-container">
      <header className="header">
        <img src="/logo.png" alt="Faculdade CDPI" className="logo" />
      </header>

      <main className="main-content">
        <div className="header-3d">
          <img src="/header-3d.png" alt="Folia Pharma" />
        </div>

        <PrizeWheel rotation={rotation} segments={WHEEL_SEGMENTS} />

        <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
          Girar
        </button>

        <p className="result-text">
          {wonPrize ? (
            <>
              Parabéns!, Você ganhou <strong>{wonPrize.label}</strong>
            </>
          ) : (
            ''
          )}
        </p>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <img src="/logo.png" alt="CDPI" className="footer-logo" />
          <div className="social-icons">
            <button type="button" className="social-icon" aria-label="Instagram">
              ig
            </button>
            <button type="button" className="social-icon" aria-label="Facebook">
              f
            </button>
            <button type="button" className="social-icon" aria-label="YouTube">
              yt
            </button>
            <button type="button" className="social-icon" aria-label="LinkedIn">
              in
            </button>
          </div>
          <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra
            maecenas accumsan lacus vel facilisis.
          </p>
        </div>
      </footer>

      {showModal && wonPrize && (
        <PrizeModal prizeLabel={wonPrize.label} onClose={handleCloseModal} />
      )}
    </div>
  )
}
