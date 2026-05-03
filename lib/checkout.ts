import type {
  ShippingFormData,
  ShippingFormErrors,
} from "@/types/checkout";

export const DEFAULT_SHIPPING_FORM: ShippingFormData = {
  email: "",
  subscribe: true,
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
};

export function validateShippingForm(
  form: ShippingFormData
): ShippingFormErrors {
  const errors: ShippingFormErrors = {};

  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.phone.trim()) errors.phone = "Phone is required.";
  if (!form.address1.trim()) errors.address1 = "Street address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.state.trim()) errors.state = "State is required.";
  if (!form.zip.trim()) errors.zip = "Zip code is required.";

  return errors;
}

export function hasShippingErrors(errors: ShippingFormErrors) {
  return Object.keys(errors).length > 0;
}

export function getShippingLabel(
  selectedDelivery: { label: string; price: number } | null
) {
  if (!selectedDelivery) return "Select method";

  return `${selectedDelivery.label} - ${
    selectedDelivery.price === 0
      ? "Free"
      : `$${selectedDelivery.price.toFixed(2)}`
  }`;
}