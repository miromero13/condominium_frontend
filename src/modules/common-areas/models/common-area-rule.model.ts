import { type ApiBase } from '@/models/api-base'

export interface CommonAreaRule extends ApiBase {
  title: string
  description: string
  is_active: boolean
  common_area: string
  created_by: string
  priority: number
}

export interface CreateCommonAreaRule extends Partial<Omit<CommonAreaRule, 'id' | 'created_at' | 'updated_at' | 'created_by'>> {
  title: string
  description: string
  common_area: string
  is_active?: boolean
  priority?: number
}

export interface FormCommonAreaRule extends Partial<CommonAreaRule> {
  // Campos específicos para formularios
}

export interface UpdateCommonAreaRule extends CreateCommonAreaRule {
  id: string // requerido para update
}