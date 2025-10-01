import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, Home, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const paymentIntentId = searchParams.get('payment_intent');
  const paymentId = searchParams.get('payment_id');
  const reason = searchParams.get('reason') || 'cancelled_by_user';

  useEffect(() => {
    // Simular un pequeño delay para mostrar el loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getReason = () => {
    switch (reason) {
      case 'insufficient_funds':
        return 'Fondos insuficientes en tu método de pago';
      case 'card_declined':
        return 'Tu tarjeta fue rechazada';
      case 'expired_card':
        return 'Tu tarjeta ha expirado';
      case 'network_error':
        return 'Error de conexión durante el procesamiento';
      case 'cancelled_by_user':
      default:
        return 'El pago fue cancelado por el usuario';
    }
  };

  const getReasonIcon = () => {
    switch (reason) {
      case 'insufficient_funds':
      case 'card_declined':
      case 'expired_card':
        return <AlertTriangle className="h-20 w-20 text-red-500 mx-auto" />;
      case 'network_error':
        return <RefreshCw className="h-20 w-20 text-orange-500 mx-auto" />;
      case 'cancelled_by_user':
      default:
        return <XCircle className="h-20 w-20 text-gray-500 mx-auto" />;
    }
  };

  const getColorClasses = () => {
    switch (reason) {
      case 'insufficient_funds':
      case 'card_declined':
      case 'expired_card':
        return {
          bg: 'from-red-50 to-pink-50',
          badge: 'bg-red-100 text-red-800',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'network_error':
        return {
          bg: 'from-orange-50 to-yellow-50',
          badge: 'bg-orange-100 text-orange-800',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'cancelled_by_user':
      default:
        return {
          bg: 'from-gray-50 to-slate-50',
          badge: 'bg-gray-100 text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Verificando transacción...</h2>
        </div>
      </div>
    );
  }

  const colors = getColorClasses();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icono de error/cancelación */}
        <div className="mb-6">
          {getReasonIcon()}
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pago No Completado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago no pudo ser procesado. No se realizó ningún cargo a tu método de pago.
        </p>

        {/* Razón del fallo */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Motivo:</h3>
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${colors.badge}`}>
            {getReason()}
          </div>
        </div>

        {/* Detalles del intento */}
        {(paymentIntentId || paymentId) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Detalles del Intento:</h3>
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Pago:</span>
                  <span className="font-mono text-gray-800">{paymentId}</span>
                </div>
              )}
              {paymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Intent ID:</span>
                  <span className="font-mono text-gray-800">{paymentIntentId.substring(0, 20)}...</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-800">{new Date().toLocaleDateString('es-CO')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sugerencias */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-semibold text-blue-800 mb-2">¿Qué puedes hacer ahora?</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Verificar que tu método de pago tenga fondos suficientes</li>
            <li>• Intentar con una tarjeta diferente</li>
            <li>• Contactar a tu banco si el problema persiste</li>
            <li>• Intentar el pago nuevamente más tarde</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className={`w-full ${colors.button} text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Intentar Nuevamente
          </button>
          
          <Link
            to="/dashboard"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Mensaje de ayuda */}
        <p className="text-sm text-gray-500 mt-6">
          Si necesitas ayuda, contacta a nuestro soporte técnico
        </p>
      </div>
    </div>
  );
}