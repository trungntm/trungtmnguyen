export function EngineeringPhilosophy() {
  return (
    <section
      className="page-container px-4 pb-20 md:px-6 md:pb-24"
      aria-labelledby="engineering-philosophy-heading"
    >
      <div className="glass-card relative overflow-hidden rounded-[2rem] p-7 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              Engineering philosophy
            </p>
            <h2
              className="max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id="engineering-philosophy-heading"
            >
              Engineering with clarity, not ceremony.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
            I prefer systems that are understandable, observable, and built around clear
            contracts. The goal is not to chase patterns, but to choose structures that help
            products and teams grow without losing delivery speed.
          </p>
        </div>
      </div>
    </section>
  );
}
