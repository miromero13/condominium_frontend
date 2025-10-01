import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Camera, Upload, Scan, RefreshCw, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import { useDetectFace } from '../../hooks/useDetectFace'

const FaceDetectorPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Detector de Personas' }
  ])

  const navigate = useNavigate()
  const { detectFace, isDetecting } = useDetectFace()

  // Estados del componente
  const [cameraActive, setCameraActive] = useState(false)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Referencias para la cámara y streaming
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Detección de rostro y registro en EventoAI
  const handleDetection = useCallback(async (image: File | string, _source: 'camera' | 'upload' | 'stream') => {
    try {
      const result = await detectFace({ image })
      setDetectionResult(result)
      if (result.authorized_person) {
        toast.success('Persona autorizada')
      } else {
        toast.warning('Persona NO autorizada')
      }
    } catch (error: any) {
      toast.error(error.errorMessages?.[0] ?? 'Error al detectar persona')
    }
  }, [detectFace])

  // Iniciar cámara y streaming
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Su navegador no soporta acceso a la cámara')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      })
      streamRef.current = stream
      setCameraActive(true)
      toast.success('Cámara activada')
    } catch (error) {
      toast.error(`Error de cámara: ${(error as Error).message || 'Error desconocido'}`)
    }
  }, [])

  // Detener cámara y streaming
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
  }, [])

  // Asignar el stream al video cuando cameraActive cambie
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      // Iniciar streaming de frames cada 4 segundos
      streamingIntervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current
          const video = videoRef.current
          const ctx = canvas.getContext('2d')
          if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx.drawImage(video, 0, 0)
            const imageBase64 = canvas.toDataURL('image/jpeg', 0.8)
            handleDetection(imageBase64, 'stream')
          }
        }
      }, 4000)
    }
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current)
        streamingIntervalRef.current = null
      }
    }
  }, [cameraActive, handleDetection])

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current)
      }
    }
  }, [])

  // Capturar imagen de la cámara y detectar
  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Error: Referencias de video o canvas no disponibles')
      return
    }
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      toast.error('Error: No se pudo obtener contexto del canvas')
      return
    }
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Error: El video no está activo')
      return
    }
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8)
    await handleDetection(imageBase64, 'camera')
  }, [handleDetection])

  // Manejar upload de archivo y detectar
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }
    setSelectedFile(file)
    await handleDetection(file, 'upload')
  }, [handleDetection])

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      {/* Header */}
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detector de Personas IA</h1>
        <div className="ml-auto flex gap-2">
          {!cameraActive ? (
            <Button onClick={startCamera} size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Activar Cámara
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Desactivar Cámara
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Cámara */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Cámara en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Cámara desactivada</p>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <Button 
              onClick={captureImage} 
              disabled={!cameraActive || isDetecting}
              className="w-full gap-2"
              size="lg"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Detectando...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  Capturar y Detectar Persona
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        {/* Panel de Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Imagen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isDetecting}
                className="cursor-pointer"
              />
            </div>
            {selectedFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center gap-2">
                <p className="text-sm text-blue-800">
                  Archivo seleccionado: <strong>{selectedFile.name}</strong>
                </p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Previsualización"
                  className="max-w-xs max-h-48 rounded border"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Resultado de Detección */}
      {detectionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {detectionResult.authorized_person ? <UserCheck className="h-5 w-5 text-green-600" /> : <UserX className="h-5 w-5 text-red-600" />}
              Resultado de Detección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Usuario Detectado</p>
                <p className="text-2xl font-mono font-bold">
                  {detectionResult.person_info?.nombre || 'No detectado'}
                </p>
                {detectionResult.authorized_person && detectionResult.person_info?.email && (
                  <p className="text-base font-mono text-blue-700">
                    {detectionResult.person_info.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Confianza</p>
                <div className="flex items-center gap-2">
                  <Badge variant={detectionResult.confidence > 0.8 ? 'default' : 'secondary'}>
                    {Math.min(detectionResult.confidence * 100, 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Estado</p>
                <Badge 
                  variant={detectionResult.authorized_person ? 'success' : 'destructive'}
                >
                  {detectionResult.authorized_person ? 'AUTORIZADO' : 'NO AUTORIZADO'}
                </Badge>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>Mensaje:</strong> {detectionResult.mensaje}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Tiempo de procesamiento: {detectionResult.tiempo_procesamiento}s
              </p>
            </div>
            {detectionResult.person_info && (
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Información de la Persona</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nombre:</strong> {detectionResult.person_info.nombre}</p>
                  <p><strong>Email:</strong> {detectionResult.person_info.email ?? 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {detectionResult.person_info.telefono ?? 'No disponible'}</p>
                  <p><strong>Rol:</strong> {detectionResult.person_info.rol}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default FaceDetectorPage