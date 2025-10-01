import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, FileText, Clock } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentIntentId = searchParams.get('payment_intent');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Simular carga de detalles del pago
    const timer = setTimeout(() => {
      setPaymentDetails({
        id: paymentId || 'N/A',
        amount: searchParams.get('amount') || '0',
        currency: searchParams.get('currency') || 'COP',
        description: searchParams.get('description') || 'Pago procesado exitosamente'
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [paymentIntentId, paymentId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Procesando pago...</h2>
          <p className="text-gray-500 mt-2">Por favor espera mientras confirmamos tu transacción</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icono de éxito */}
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
        </p>

        {/* Detalles del pago */}
        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Detalles del Pago
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Pago:</span>
                <span className="font-mono text-sm text-gray-800">{paymentDetails.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-semibold text-gray-800">
                  ${Number(paymentDetails.amount).toLocaleString()} {paymentDetails.currency}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completado
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-800 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> Tu recibo será enviado al correo electrónico asociado a tu cuenta. 
            Si tienes alguna pregunta, puedes contactar a nuestro equipo de soporte.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Dashboard
          </Link>
          
          <Link
            to="/payments"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            Ver Mis Pagos
          </Link>
        </div>

        {/* Mensaje de agradecimiento */}
        <p className="text-sm text-gray-500 mt-6">
          Gracias por usar nuestros servicios ✨
        </p>
      </div>
    </div>
  );
}