import { env } from '@/env'
import { createClient } from '@eventer/backend'

export const client = createClient(env.NEXT_PUBLIC_BACKEND_URL)
