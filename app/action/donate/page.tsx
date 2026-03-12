"use client"

import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const PRESET_AMOUNTS = [
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 250, label: "$250" },
  { value: 500, label: "$500" },
]

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

interface DonorInfo {
  fullName: string
  streetAddress: string
  city: string
  state: string
  zip: string
  occupation: string
  employer: string
}

export default function ActionDonatePage() {
  const [amount, setAmount] = useState<number | "other">(50)
  const [customAmount, setCustomAmount] = useState("")
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    occupation: "",
    employer: "",
  })
  const [certified, setCertified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const numericAmount =
    amount === "other"
      ? parseFloat(customAmount) || 0
      : amount

  function updateDonorInfo(field: keyof DonorInfo, value: string) {
    setDonorInfo(prev => ({ ...prev, [field]: value }))
  }

  function validateForm(): boolean {
    if (numericAmount < 1) {
      setError("Please enter an amount of at least $1.00")
      return false
    }
    if (!donorInfo.fullName.trim()) {
      setError("Please enter your full name")
      return false
    }
    if (!donorInfo.streetAddress.trim()) {
      setError("Please enter your street address")
      return false
    }
    if (!donorInfo.city.trim()) {
      setError("Please enter your city")
      return false
    }
    if (!donorInfo.state) {
      setError("Please select your state")
      return false
    }
    if (!donorInfo.zip.trim()) {
      setError("Please enter your ZIP code")
      return false
    }
    if (!donorInfo.occupation.trim()) {
      setError("Please enter your occupation")
      return false
    }
    if (!donorInfo.employer.trim()) {
      setError("Please enter your employer")
      return false
    }
    if (!certified) {
      setError("Please certify your eligibility to contribute")
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          donorInfo,
          entity: "action",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create checkout")
      if (data.url) window.location.href = data.url
      else throw new Error("No checkout URL returned")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Link
            href="/action"
            className="text-base font-light tracking-[0.05em] text-foreground/90 hover:text-foreground transition-colors"
          >
            Americans for Opportunity Action
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16 md:py-24 px-8">
        <div className="w-full max-w-md">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-foreground mb-2">
              Donate
            </h1>
            <p className="text-sm font-light text-muted-foreground/80 mb-8">
              Contributions to Americans for Opportunity Action are not tax deductible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donation Amount */}
              <div>
                <p className="text-sm font-light text-foreground/90 mb-3">
                  Select an amount
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setAmount(preset.value)}
                      className={`py-3 px-4 rounded-xl border text-sm font-light transition-all ${
                        amount === preset.value
                          ? "border-foreground bg-foreground/10 text-foreground"
                          : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("other")}
                    className={`py-3 px-4 rounded-xl border text-sm font-light transition-all ${
                      amount === "other"
                        ? "border-foreground bg-foreground/10 text-foreground"
                        : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {amount === "other" && (
                <div>
                  <label
                    htmlFor="custom-amount"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    Enter amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-light">
                      $
                    </span>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-border/60 bg-background font-light text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              )}

              {/* Donor Information */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <h2 className="text-lg font-light tracking-wide text-foreground mb-4">
                  Donor Information
                </h2>

                <p className="text-xs font-light text-muted-foreground/70 leading-relaxed mb-4 pb-4 border-b border-border/30">
                  Federal law requires us to use our best efforts to collect and report the name, mailing address, occupation, and employer of individuals whose contributions exceed $200 in an election cycle.
                </p>

                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="full-name"
                    type="text"
                    required
                    value={donorInfo.fullName}
                    onChange={(e) => updateDonorInfo("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                  />
                </div>

                <div>
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    Street Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="street-address"
                    type="text"
                    required
                    value={donorInfo.streetAddress}
                    onChange={(e) => updateDonorInfo("streetAddress", e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-light text-foreground/90 mb-2"
                    >
                      City <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="city"
                      type="text"
                      required
                      value={donorInfo.city}
                      onChange={(e) => updateDonorInfo("city", e.target.value)}
                      placeholder="New York"
                      className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-light text-foreground/90 mb-2"
                    >
                      State <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={donorInfo.state}
                      onValueChange={(value) => updateDonorInfo("state", value)}
                      required
                    >
                      <SelectTrigger className="w-full py-3 rounded-xl border border-border/60 bg-background font-light">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="zip"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    ZIP Code <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="zip"
                    type="text"
                    required
                    value={donorInfo.zip}
                    onChange={(e) => updateDonorInfo("zip", e.target.value)}
                    placeholder="10001"
                    className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                  />
                </div>

                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    Occupation <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="occupation"
                    type="text"
                    required
                    value={donorInfo.occupation}
                    onChange={(e) => updateDonorInfo("occupation", e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                  />
                </div>

                <div>
                  <label
                    htmlFor="employer"
                    className="block text-sm font-light text-foreground/90 mb-2"
                  >
                    Employer <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="employer"
                    type="text"
                    required
                    value={donorInfo.employer}
                    onChange={(e) => updateDonorInfo("employer", e.target.value)}
                    placeholder="Company Name"
                    className="w-full py-3 rounded-xl border border-border/60 bg-background font-light"
                  />
                </div>
              </div>

              {/* Donor Eligibility Certification */}
              <div className="pt-4 border-t border-border/40">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="certification"
                    checked={certified}
                    onCheckedChange={(checked) => setCertified(checked === true)}
                    className="mt-1"
                    required
                  />
                  <label
                    htmlFor="certification"
                    className="text-sm font-light text-foreground/90 leading-relaxed cursor-pointer"
                  >
                    <span className="font-medium">By contributing I certify that:</span>
                    <ul className="mt-2 space-y-1.5 list-none pl-0">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/70 mt-0.5">•</span>
                        <span>I am a U.S. citizen or lawful permanent resident (green card holder).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/70 mt-0.5">•</span>
                        <span>This contribution is made from my own funds.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/70 mt-0.5">•</span>
                        <span>I am not a federal contractor.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/70 mt-0.5">•</span>
                        <span>I am at least 18 years old.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/70 mt-0.5">•</span>
                        <span>I am not making this contribution on behalf of another person.</span>
                      </li>
                    </ul>
                  </label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive font-light">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !certified}
                className="w-full py-4 text-sm font-light tracking-wide bg-foreground text-background rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
              >
                {loading ? "Redirecting to checkout…" : `Continue to Payment`}
              </button>
            </form>

            <p className="mt-6 text-xs font-light text-muted-foreground/70 text-center">
              You will be redirected to Stripe to complete your donation securely.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-xs font-light tracking-wide text-muted-foreground/70">
            Paid for by Americans for Opportunity Action. Not authorized by any candidate or candidate&apos;s committee.
          </p>
        </div>
      </footer>
    </div>
  )
}
