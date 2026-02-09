import { useState } from 'react'
import { formatPhoneNumber, normalizeDigitsData } from '../utils/formatters'
import './Page1.css'

type RegistrationProps = Readonly<{
  onSubmit: (data: { name: string; phone: string; email: string; course: string; goal: string; id?: string }) => void
}>

export default function Registration({ onSubmit }: RegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    goal: '',
  })
  const goalOptions = [
    "Crescimento profissional",
    "Transição de área",
    "Atualização técnica",
    "Diferencial competitivo no mercado",
    "Outro"
  ];
  const [isLoading, setIsLoading] = useState(false)

  const isValid = Boolean(formData.name.trim() && formData.phone.trim() && formData.email.trim() && formData.course.trim() && formData.goal.trim())

  const handleChange = (field: 'name' | 'phone' | 'email' | 'course' | 'goal', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return

    setIsLoading(true)

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: normalizeDigitsData(formData.phone),
      course: formData.course,
      goal: formData.goal,
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.status === 409) {
        alert('Este CPF já está participando!')
        setIsLoading(false)
        return
      }

      if (!response.ok) throw new Error(result.error)

      onSubmit({ ...payload, id: result.id })

    } catch (error) {
      alert('Erro ao conectar com o servidor.')
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container registration-page">
      <header className="header">
        <img src="/logo.png" alt="Faculdade CDPI" className="logo" />
      </header>

      <main className="main-content">
        <div className="header-3d">
          <img src="/header-3d.png" alt="Folia Pharma" />
        </div>

        <div className="card">
          <h2 className="card-title">Preencha para participar</h2>
          <form className="form-fields" onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(event) => handleChange('name', event.target.value)}
            />
            <input
              className="input-field"
              type="tel"
              placeholder="Seu telefone"
              value={formatPhoneNumber(formData.phone)}
              onChange={(event) => handleChange('phone', event.target.value)}
            />
            <input
              className="input-field"
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
            />
            <h3 className="card-title">Se hoje você fosse iniciar uma Pós-Graduação, qual escolheria?</h3>
            <select 
              className="input-field select-field"
              value={formData.course}
              onChange={(event) => handleChange('course', event.target.value)}
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="Pós-Graduação em P&D Farmacotécnico e Produção de Medicamentos">Pós-Graduação em P&D Farmacotécnico e Produção de Medicamentos</option>
              <option value="Pós-Graduação em Toxicologia Industrial">Pós-Graduação em Toxicologia Industrial</option>
              <option value="Pós-Graduação em Gestão da Qualidade e Formação de Auditores">Pós-Graduação em Gestão da Qualidade e Formação de Auditores</option>
              <option value="Pós-Graduação em Desenvolvimento Analítico e Controle de Qualidade">Pós-Graduação em Desenvolvimento Analítico e Controle de Qualidade</option>
              <option value="Pós-Graduação em Assuntos Regulatórios">Pós-Graduação em Assuntos Regulatórios</option>
              <option value="Pós-Graduação em Indústria Farmacêutica">Pós-Graduação em Indústria Farmacêutica</option>
              <option value="Pós-Graduação em Produtos Biológicos & Biossimilares">Pós-Graduação em Produtos Biológicos & Biossimilares</option>
              <option value="Pós-Graduação em Estatística Aplicada à Indústria Farmacêutica">Pós-Graduação em Estatística Aplicada à Indústria Farmacêutica</option>
              <option value="Pós-Graduação em Indústria Veterinária">Pós-Graduação em Indústria Veterinária</option>
            </select>

            <div className="radio-group-container">
              <h3 className="card-label">Seu principal objetivo ao fazer uma pós-graduação é:</h3>
              <div className="radio-options">
                {goalOptions.map((option) => (
                  <label key={option} className="radio-label">
                    <input
                      type="radio"
                      name="goal"
                      value={option}
                      checked={formData.goal === option}
                      onChange={(e) => handleChange('goal', e.target.value)}
                      className="radio-input"
                    />
                    <span className="radio-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="submit-button" type="submit" disabled={!isValid || isLoading}>
              {isLoading ? 'Carregando...' : '🎁 Clique aqui'}
            </button>
          </form>
        </div>
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
    </div>
  )
}
