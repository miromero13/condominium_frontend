export interface CondominiumInfo {
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website: string
  nit: string
  registration_date: string
  description: string
}

export interface ContactPerson {
  name: string
  phone: string
  email: string
  position: string
}

export interface ContactInfo {
  administrator: ContactPerson
  security: ContactPerson
  maintenance: ContactPerson
}

export interface UpdateCondominiumInfoRequest {
  name?: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  nit?: string
  registration_date?: string
  description?: string
}

export interface UpdateContactPersonRequest {
  name?: string
  phone?: string
  email?: string
  position?: string
}

export interface UpdateAllContactsRequest {
  administrator?: UpdateContactPersonRequest
  security?: UpdateContactPersonRequest
  maintenance?: UpdateContactPersonRequest
}