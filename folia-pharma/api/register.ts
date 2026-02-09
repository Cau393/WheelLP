import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

type RegisterRequest = {
  method?: string
  body: {
    name: string
    email: string
    phone: string
    course: string
    goal: string
  }
}

type RegisterResponse = {
  status: (code: number) => RegisterResponse
  send: (body: string) => void
  json: (body: unknown) => void
}

// 1. Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export default async function handler(req: RegisterRequest, res: RegisterResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { name, email, phone, course, goal } = req.body

  // A. Try to Insert into Supabase (This performs the CPF check automatically)
  const { data, error } = await supabase
    .from('participants')
    .insert([{ name, email, phone, course, goal }])
    .select()

  if (error) {
    if (error.code === '23505') { 
      return res.status(409).json({ error: 'Phone_ALREADY_USED' })
    }
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ success: true, id: data[0].id })
}
