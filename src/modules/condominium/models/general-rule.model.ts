import { type ApiBase } from '@/models'

export interface GeneralRule extends ApiBase {
  title: string
  description: string
  is_active: boolean
  created_by: {
    id: string
    username: string
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

export interface CreateGeneralRule extends Partial<Omit<GeneralRule, 'id' | 'created_at' | 'updated_at' | 'created_by'>> {
  title: string
  description: string
  is_active?: boolean
}

export interface FormGeneralRule extends Partial<GeneralRule> {
  // Campos específicos para formularios
}

export interface UpdateGeneralRule extends CreateGeneralRule {
  id: string
}