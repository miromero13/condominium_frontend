/**
 * Tipos e interfaces para el módulo de cuotas y pagos
 * Basado en los modelos del backend Django
 */

import { type ApiBase } from '@/models';

// Enums del sistema de pagos
export enum QuoteStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentGatewayType {
  MERCADOPAGO = 'mercadopago',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Interfaces principales
export interface PaymentMethod extends ApiBase {
  name: string;
  description?: string;
  requires_gateway: boolean;
  manual_verification: boolean;
  is_active: boolean;
}

export interface PaymentGateway extends ApiBase {
  name: string;
  gateway_type: PaymentGatewayType;
  config_data: Record<string, any>;
  bank_info: Record<string, any>;
  is_active: boolean;
  is_test_mode: boolean;
}

export interface Quote extends ApiBase {
  house_user: number; // ID de HouseUser
  payment_method?: PaymentMethod;
  payment_gateway?: PaymentGateway;
  amount: string; // Decimal como string
  due_date: string; // ISO date
  paid_date?: string; // ISO datetime
  payment_reference?: string;
  payment_data: Record<string, any>;
  status: QuoteStatus;
  period_year: number;
  period_month?: number; // null para cuotas anuales
  description: string;
  is_overdue?: boolean; // Calculado
  
  // Datos relacionados (expandidos en list/detail)
  house_user_info?: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    house: {
      id: number;
      code: string;
      address?: string;
    };
    type_house: string;
  };
  payment_method_name?: string;
  status_display?: string;
}

export interface PaymentTransaction extends ApiBase {
  quote: number; // ID de Quote
  payment_gateway?: PaymentGateway;
  transaction_id: string;
  external_id?: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  gateway_response: Record<string, any>;
  payment_details: Record<string, any>;
  processed_at?: string; // ISO datetime
  confirmed_at?: string; // ISO datetime
}

// DTOs para formularios y requests
export interface CreateQuoteRequest {
  house_user_id: number;
  payment_method_id?: number;
  amount: string;
  due_date: string;
  description: string;
  period_year: number;
  period_month?: number;
}

export interface AutoGenerateQuotesRequest {
  house_user_id: number;
  payment_method_id: number;
  start_year: number;
  start_month?: number;
  end_month?: number;
  base_amount?: string;
  description_template?: string;
}

export interface MarkAsPaidRequest {
  quote_ids: string[]; // IDs son UUIDs (strings)
  payment_date?: string;
}

export interface CreatePaymentLinkRequest {
  quote_id: string; // ID es UUID (string)
  gateway_type: PaymentGatewayType;
  payer_email?: string;
}

// Respuestas de APIs
export interface QuoteListResponse {
  results: Quote[];
  count: number;
  next?: string;
  previous?: string;
}

export interface QuoteStatistics {
  year: number;
  statistics: {
    total_quotes: number;
    pending_quotes: number;
    paid_quotes: number;
    overdue_quotes: number;
    cancelled_quotes: number;
    total_amount_pending: string;
    total_amount_paid: string;
    total_amount_overdue: string;
  };
}

export interface PaymentLinkResponse {
  success: boolean;
  payment_url?: string;
  sandbox_url?: string;
  transaction_id?: string;
  preference_id?: string;
  expires_at?: string;
  error?: string;
  details?: any;
}

// Filtros para listas
export interface QuoteFilters {
  house_id?: number;
  user_id?: number;
  status?: QuoteStatus;
  year?: number;
  month?: number;
  overdue?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaymentMethodFilters {
  is_active?: boolean;
  requires_gateway?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// Tipos para componentes
export interface QuoteTableRow extends Quote {
  house_code: string;
  user_name: string;
  user_type_display: string;
  amount_display: string;
  due_date_display: string;
  status_color: string;
  actions_available: string[];
}

export interface PaymentMethodOption {
  value: number;
  label: string;
  description?: string;
  requires_gateway: boolean;
  manual_verification: boolean;
}

// Validaciones
export interface QuoteFormData {
  house_user_id: number | null;
  payment_method_id: number | null;
  amount: string;
  due_date: string;
  description: string;
  period_year: number;
  period_month: number | null;
}

export interface PaymentMethodFormData {
  name: string;
  description: string;
  requires_gateway: boolean;
  manual_verification: boolean;
}

// Estados de carga
export interface QuoteModuleState {
  quotes: Quote[];
  paymentMethods: PaymentMethod[];
  paymentGateways: PaymentGateway[];
  statistics: QuoteStatistics | null;
  selectedQuote: Quote | null;
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}

// Permisos específicos del módulo
export interface QuotePermissions {
  canViewQuotes: boolean;
  canCreateQuotes: boolean;
  canEditQuotes: boolean;
  canDeleteQuotes: boolean;
  canMarkAsPaid: boolean;
  canGenerateQuotes: boolean;
  canViewPaymentMethods: boolean;
  canCreatePaymentMethods: boolean;
  canEditPaymentMethods: boolean;
  canDeletePaymentMethods: boolean;
  canViewStatistics: boolean;
  canCreatePaymentLinks: boolean;
}

