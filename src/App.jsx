

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          PowerDialer
        </p>

        <h1 className="text-4xl font-bold text-white">
          Tailwind CSS is working
        </h1>

        <p className="mt-3 text-slate-400">
          M1 frontend setup is progressing successfully.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Continue Setup
        </button>
      </section>
    </main>
  )
}

export default App

