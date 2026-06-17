import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { isValidWebhookSignature } from "@/lib/lemonsqueezy";

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      user_email?: string;
      test_mode?: boolean;
      first_order_item?: {
        variant_id?: number;
        variant_name?: string;
        product_name?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const signature = (await headers()).get("x-signature");
  const rawBody = await request.text();

  if (!signature || !isValidWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const payload = JSON.parse(rawBody) as LemonWebhookPayload;

    if (payload.meta?.event_name === "order_created") {
      console.log("Lemon Squeezy order created", {
        orderId: payload.data?.id,
        status: payload.data?.attributes?.status,
        email: payload.data?.attributes?.user_email,
        variantId: payload.data?.attributes?.first_order_item?.variant_id,
        variantName: payload.data?.attributes?.first_order_item?.variant_name,
        testMode: payload.data?.attributes?.test_mode,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Failed to process Lemon Squeezy webhook", error);
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }
}
