import { CheckoutClient } from "@/components/app-launch-kit/checkout-client";

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12">
      <CheckoutClient />
    </main>
  );
}

