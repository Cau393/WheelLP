import { createClient } from '@supabase/supabase-js'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

type PrizeRequest = {
  method?: string
  body: {
    name: string
    email: string
    phone: string
    course: string
    goal: string
    id?: string
    prize: string
    code: string
  }
}

type PrizeResponse = {
  status: (code: number) => PrizeResponse
  send: (body: string) => void
  json: (body: unknown) => void
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!.replaceAll(String.raw`\n`, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export default async function handler(req: PrizeRequest, res: PrizeResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { id, prize, code, name, email, phone, course, goal } = req.body

  if (!id || !prize || !code) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { error: dbError } = await supabase
      .from('participants')
      .update({ 
        prize_name: prize, 
        prize_code: code,
      })
      .eq('id', id)

    if (dbError) throw dbError
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth)
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    
    await sheet.addRow({
      Data: new Date().toLocaleString('pt-BR'),
      Nome: name,
      Curso: course,
      Telefone: phone,
      Email: email,
      Premio: prize,
      Codigo: code,
      Objetivo: goal,
    })

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Failed to update' })
  }
}