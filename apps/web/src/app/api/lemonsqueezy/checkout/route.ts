import { NextResponse } from "next/server";

import { type PaidPlan } from "@/lib/app-launch-kit";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

type CheckoutBody = {
  plan?: PaidPlan;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const plan = body.plan;

    if (plan !== "full" && plan !== "pro") {
      return NextResponse.json(
        { error: "Only paid plans can create a Lemon Squeezy checkout." },
        { status: 400 },
      );
    }

    const url = await createCheckoutUrl(plan);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to create Lemon Squeezy checkout", error);

    return NextResponse.json(
      { error: "Unable to create Lemon Squeezy checkout." },
      { status: 500 },
    );
  }
}

