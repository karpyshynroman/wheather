interface LocationFormProps {
  value: string;
  errors: string[];
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
}

export function LocationForm({ value, errors, onChange, onSubmit, isSubmitting }: LocationFormProps) {
  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/55">Location</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Try Helsinki, Tokyo, or New York"
          className="w-full rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
      {errors.length > 0 ? (
        <ul className="space-y-1 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white/50">Validation runs before the query is sent.</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-3xl bg-white px-4 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Loading weather…' : 'Show weather'}
      </button>
    </form>
  );
}
