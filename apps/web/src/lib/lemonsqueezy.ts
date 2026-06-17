import crypto from "node:crypto";

import { type PaidPlan } from "@/lib/app-launch-kit";

const requiredVariables = [
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_STORE_ID",
  "LEMONSQUEEZY_FULL_KIT_VARIANT_ID",
  "LEMONSQUEEZY_PRO_KIT_VARIANT_ID",
  "NEXT_PUBLIC_APP_URL",
] as const;

type LemonCheckoutResponse = {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
};

function readRequiredEnv(name: (typeof requiredVariables)[number]) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getAppUrl() {
  return readRequiredEnv("NEXT_PUBLIC_APP_URL");
}

export function getWebhookSecret() {
  return process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";
}

export function getVariantIdForPlan(plan: PaidPlan) {
  if (plan === "full") {
    return readRequiredEnv("LEMONSQUEEZY_FULL_KIT_VARIANT_ID");
  }

  if (plan === "pro") {
    return readRequiredEnv("LEMONSQUEEZY_PRO_KIT_VARIANT_ID");
  }

  throw new Error("Free plan does not have a Lemon Squeezy variant.");
}

export function isTestModeEnabled() {
  return process.env.LEMONSQUEEZY_TEST_MODE !== "false";
}

export async function createCheckoutUrl(plan: PaidPlan) {
  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${readRequiredEnv("LEMONSQUEEZY_API_KEY")}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [Number(getVariantIdForPlan(plan))],
            redirect_url: `${getAppUrl()}/?checkout=success&plan=${plan}`,
          },
          checkout_options: {
            discount: false,
            media: false,
            logo: true,
          },
          checkout_data: {
            custom: {
              plan,
              source: "applaunchkit-web",
            },
          },
          test_mode: isTestModeEnabled(),
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: readRequiredEnv("LEMONSQUEEZY_STORE_ID"),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: getVariantIdForPlan(plan),
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lemon Squeezy checkout failed: ${text}`);
  }

  const payload = (await response.json()) as LemonCheckoutResponse;
  return payload.data.attributes.url;
}

export function isValidWebhookSignature(rawBody: string, signature: string) {
  const secret = getWebhookSecret();

  if (!secret) {
    return false;
  }

  const digest = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "utf8",
  );
  const incoming = Buffer.from(signature, "utf8");

  if (digest.length !== incoming.length) {
    return false;
  }

  return crypto.timingSafeEqual(digest, incoming);
}
