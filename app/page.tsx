import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <span className="text-base font-light tracking-[0.05em] text-foreground/90">
            Americans for Opportunity
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-32 md:py-48 lg:py-56">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <p className="text-xs font-light tracking-[0.2em] uppercase text-muted-foreground/70 mb-8">
                Independent Expenditure Committee
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-foreground mb-8 text-balance leading-[1.1]">
                Coming Soon
              </h1>
              <p className="text-xl md:text-2xl font-light text-muted-foreground/80 max-w-2xl mx-auto mb-16 text-pretty leading-relaxed">
                Americans for Opportunity is preparing to launch.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Link
                href="/donate"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-light tracking-wide bg-foreground text-background rounded-full hover:scale-105 active:scale-100 transition-all duration-300 ease-out shadow-lg hover:shadow-xl min-w-[160px] overflow-hidden"
              >
                <span className="relative z-10">Donate</span>
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                href="mailto:jpp@prestonpublicaffairs.com"
                className="group inline-flex items-center justify-center px-10 py-4 text-sm font-light tracking-wide bg-transparent text-foreground border border-border/60 rounded-full hover:border-foreground/40 hover:bg-foreground/5 active:scale-95 transition-all duration-300 ease-out min-w-[160px] backdrop-blur-sm"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-24 md:py-32 border-t border-border/40 bg-gradient-to-b from-background to-card/30">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* About Card */}
              <div className="group p-8 border border-border/40 rounded-2xl bg-background/50 backdrop-blur-sm hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-500 ease-out hover:-translate-y-1">
                <h3 className="text-lg font-light tracking-wide text-foreground mb-4">
                  About
                </h3>
                <p className="text-sm font-light text-muted-foreground/80 leading-relaxed">
                  Americans for Opportunity is an independent expenditure committee organized to support candidates and causes aligned with our mission.
                </p>
              </div>

              {/* Donate Card */}
              <Link
                href="/donate"
                className="block group p-8 border border-border/40 rounded-2xl bg-background/50 backdrop-blur-sm hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-500 ease-out hover:-translate-y-1"
              >
                <h3 className="text-lg font-light tracking-wide text-foreground mb-4">
                  Donate
                </h3>
                <p className="text-sm font-light text-muted-foreground/80 leading-relaxed">
                  Contributions to Americans for Opportunity are not tax deductible. Click to contribute securely via Stripe.
                </p>
              </Link>

              {/* Contact Card */}
              <div className="group p-8 border border-border/40 rounded-2xl bg-background/50 backdrop-blur-sm hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-500 ease-out hover:-translate-y-1">
                <h3 className="text-lg font-light tracking-wide text-foreground mb-4">
                  Contact
                </h3>
                <p className="text-sm font-light text-muted-foreground/80 leading-relaxed">
                  For inquiries, please reach out to us at{" "}
                  <a
                    href="mailto:jpp@prestonpublicaffairs.com"
                    className="underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground/60 transition-all duration-300"
                  >
                    jpp@prestonpublicaffairs.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-xs font-light tracking-wide text-muted-foreground/70">
              Paid for by Americans for Opportunity.
            </p>
            <p className="text-xs font-light tracking-wide text-muted-foreground/70">
              Not authorized by any candidate or candidate&apos;s committee.
            </p>
            <a
              href="mailto:jpp@prestonpublicaffairs.com"
              className="text-xs font-light tracking-wide text-muted-foreground/70 underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground/60 hover:text-foreground/80 transition-all duration-300"
            >
              jpp@prestonpublicaffairs.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
