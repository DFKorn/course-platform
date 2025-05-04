"use server"

import { getUserCoupon } from "@/lib/userCountryHeader"
import { stripeServerClient } from "../stripeServer"
import { env } from "@/data/env/client"
import { headers } from "next/headers"

export async function getClientSessionSecret(
  product: {
    priceInDollars: number
    name: string
    imageUrl: string
    description: string
    id: string
  },
  user: { email: string; id: string }
) {
  
  const origin: string = (await headers()).get("origin") as string;

  const coupon = await getUserCoupon()
  const discounts = coupon ? [{ coupon: coupon.stripeCouponId }] : undefined

  const session = await stripeServerClient.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [
              new URL(product.imageUrl, origin).href,
            ],
            description: product.description,
          },
          unit_amount: product.priceInDollars * 100,
        },
      },
    ],
    ui_mode: "embedded",
    mode: "payment",
    return_url: `${origin}/api/webhooks/stripe?stripeSessionId={CHECKOUT_SESSION_ID}`,
    customer_email: user.email,
    payment_intent_data: {
      receipt_email: user.email,
    },
    discounts,
    metadata: {
      productId: product.id,
      userId: user.id,
    },
  })

  if (session.client_secret == null) throw new Error("Client secret is null")

  return session.client_secret
}