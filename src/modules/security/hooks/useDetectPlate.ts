import { useState } from 'react'
import { fetchData } from '@/utils'
import { PlateDetectionResponse } from '../models/security.model'

export function useDetectPlate() {
  const [isDetecting, setIsDetecting] = useState(false)

  const detectPlate = async ({ image, source }: { image: File | string, source: 'camera' | 'upload' }) => {
    setIsDetecting(true)
    try {
      let image_base64 = ''
      if (typeof image === 'string') {
        image_base64 = image // Ya viene sin header desde captureImage
      } else {
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            // Quitar el header si existe
            const result = reader.result as string
            resolve(result.replace(/^data:image\/(jpeg|png);base64,/, ''))
          }
          reader.onerror = reject
          reader.readAsDataURL(image)
        })
        image_base64 = fileData
      }
      const response = await fetchData('/api/ai-system/detect-plate/', {
        method: 'POST',
        body: JSON.stringify({ image_base64, source }),
        headers: { 'Content-Type': 'application/json' }
      })
      setIsDetecting(false)
      return response.data as PlateDetectionResponse
    } catch (error: any) {
      setIsDetecting(false)
      throw error.errorMessages?.[0] || error.message || error
    }
  }

  return { detectPlate, isDetecting }
}
