import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "Checkout — NIVORA ESSENTIALS",
  description: "Complete your NIVORA order.",
};

export default function CheckoutPage() {
  return <main className="checkout-page"><CheckoutForm /></main>;
}
