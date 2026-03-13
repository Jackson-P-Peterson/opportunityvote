import Link from "next/link"

export default function FoundationDonateSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Link
            href="/foundation"
            className="text-base font-light tracking-[0.05em] text-foreground/90 hover:text-foreground transition-colors"
          >
            Americans for Opportunity Foundation
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16 md:py-24 px-8">
        <div className="max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-foreground mb-4">
            Thank you
          </h1>
          <p className="text-muted-foreground/80 font-light mb-8">
            Your donation has been received. We appreciate your support for Americans for Opportunity Foundation.
          </p>
          <Link
            href="/foundation"
            className="inline-flex items-center justify-center px-10 py-4 text-sm font-light tracking-wide bg-foreground text-background rounded-full hover:scale-105 active:scale-100 transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
          >
            Return home
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-xs font-light tracking-wide text-muted-foreground/70">
            Americans for Opportunity Foundation is a 501(c)(3) charitable organization. Contributions may be tax deductible.
          </p>
        </div>
      </footer>
    </div>
  )
}
