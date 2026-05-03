export type DeliveryMethod = {
  id: string;
  label: string;
  eta: string;
  price: number;
};

export type ShippingFormData = {
  email: string;
  subscribe: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

export type ShippingFormErrors = Partial<Record<keyof ShippingFormData, string>>;

export type SuggestedAddress = {
  name: string;
  line1: string;
  line2: string;
  country: string;
};