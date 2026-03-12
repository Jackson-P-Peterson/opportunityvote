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

    const { amount, donorInfo, entity } = await req.json()

    const isAction = entity === "action"
    const orgName = isAction
      ? "Americans for Opportunity Action"
      : "Americans for Opportunity"
    const orgDescription = isAction
      ? "Contributions to Americans for Opportunity Action are not tax deductible."
      : "Contributions to Americans for Opportunity are not tax deductible."

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

    const rawOrigin = req.headers.get("origin")
    const referer = req.headers.get("referer")
    const origin =
      rawOrigin ||
      (referer ? new URL(referer).origin : null) ||
      "http://localhost:3000"
    const successPath = isAction ? "/action/donate/success" : "/donate/success"
    const cancelPath = isAction ? "/action/donate" : "/donate"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${orgName}`,
              description: orgDescription,
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
        ...(isAction ? { entity: "action" } : {}),
      },
      success_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
