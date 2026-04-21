const steps = [
  {
    number: '1',
    title: 'Pick Your Market',
    description: 'Choose from 15 top US cities or request a new one. We\'ve done the research so you don\'t have to.',
  },
  {
    number: '2',
    title: 'Checkout Securely',
    description: 'Pay just $19 through Stripe. No subscription, no recurring fees. One market, one price.',
  },
  {
    number: '3',
    title: 'Get Your Report',
    description: 'Receive a professional PDF instantly via email. Print it, share it, use it to close your next deal.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Get Your Report in 60 Seconds
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            No account required. No learning curve. Just the data you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 dark:from-emerald-600 dark:to-emerald-800" />
              )}
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
