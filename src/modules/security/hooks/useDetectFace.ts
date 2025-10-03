import { useState } from 'react'
import { fetchData } from '@/utils'

export interface FaceDetectionResult {
  authorized_person: boolean
  confidence: number
  user_id: string
  mensaje: string
  tiempo_procesamiento: number
  person_info?: {
    nombre: string
    rol: string
    departamento: string
  }
  evento?: any
  acceso?: any
  lambda_result?: any
}

export function useDetectFace() {
  const [isDetecting, setIsDetecting] = useState(false)

  const detectFace = async ({ image }: { image: File | string }) => {
    setIsDetecting(true)
    try {
      let image_base64 = ''
      if (typeof image === 'string') {
        image_base64 = image.replace(/^data:image\/(jpeg|png);base64,/, '')
      } else {
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(image)
        })
        image_base64 = fileData
      }
      const response = await fetchData('/api/face/verify/', {
        method: 'POST',
        body: JSON.stringify({ image_base64 })
      })
      setIsDetecting(false)
      return response as FaceDetectionResult
    } catch (error: any) {
      setIsDetecting(false)
      throw error.errorMessages?.[0] || error.message || error
    }
  }

  return { detectFace, isDetecting }
}
