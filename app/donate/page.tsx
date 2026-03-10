"use client"

import Link from "next/link"
import { useState } from "react"

const PRESET_AMOUNTS = [
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 250, label: "$250" },
  { value: 500, label: "$500" },
]

export default function DonatePage() {
  const [amount, setAmount] = useState<number | "other">(50)
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const displayAmount =
    amount === "other" ? (customAmount ? `$${customAmount}` : "") : `$${amount}`

  const numericAmount =
    amount === "other"
      ? parseFloat(customAmount) || 0
      : amount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (numericAmount < 1) {
      setError("Please enter an amount of at least $1.00")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
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
            href="/"
            className="text-base font-light tracking-[0.05em] text-foreground/90 hover:text-foreground transition-colors"
          >
            Americans for Opportunity
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
              Contributions to Americans for Opportunity are not tax deductible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-border/60 bg-background font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive font-light">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || numericAmount < 1}
                className="w-full py-4 text-sm font-light tracking-wide bg-foreground text-background rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
              >
                {loading ? "Redirecting to checkout…" : `Donate ${displayAmount}`}
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
            Paid for by Americans for Opportunity. Not authorized by any candidate or candidate&apos;s committee.
          </p>
        </div>
      </footer>
    </div>
  )
}
