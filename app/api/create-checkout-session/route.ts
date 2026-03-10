import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe secret key is not configured" },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const { amount, donorInfo } = await req.json()

    const amountCents = Math.round(Number(amount) * 100)
    if (!amountCents || amountCents < 100) {
      return NextResponse.json(
        { error: "Amount must be at least $1.00" },
        { status: 400 }
      )
    }

    // Validate donor information
    if (!donorInfo) {
      return NextResponse.json(
        { error: "Donor information is required" },
        { status: 400 }
      )
    }

    const {
      fullName,
      streetAddress,
      city,
      state,
      zip,
      occupation,
      employer,
    } = donorInfo

    if (!fullName || !streetAddress || !city || !state || !zip || !occupation || !employer) {
      return NextResponse.json(
        { error: "All donor information fields are required" },
        { status: 400 }
      )
    }

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/$/, "") ||
      "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to Americans for Opportunity",
              description:
                "Contributions to Americans for Opportunity are not tax deductible.",
              images: [],
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: undefined, // We'll collect email in Stripe Checkout
      billing_address_collection: "required",
      metadata: {
        donor_full_name: fullName,
        donor_street_address: streetAddress,
        donor_city: city,
        donor_state: state,
        donor_zip: zip,
        donor_occupation: occupation,
        donor_employer: employer,
      },
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
