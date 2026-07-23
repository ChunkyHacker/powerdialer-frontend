import { Search } from 'lucide-react'

function HeaderSearch({ placeholder, disabled = false }) {
  return (
    <div
      className="
        flex
        h-control-lg
        w-[340px]
        min-w-[340px]
        max-w-full
        items-center
        gap-3
        rounded-lg
        border
        border-border-default
        bg-surface-page
        px-4
        transition-colors
        hover:border-text-secondary
        focus-within:border-brand-accent
        focus-within:bg-surface-card
        focus-within:ring-1
        focus-within:ring-brand-accent
      "
    >
      <label
        htmlFor="global-search"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Search PowerDialer
      </label>

      <Search
        aria-hidden="true"
        className="size-5 shrink-0 text-text-secondary"
      />

      <input
        id="global-search"
        type="search"
        placeholder={placeholder}
        disabled={disabled}
        className="
          min-w-0
          flex-1
          bg-transparent
          text-role-helper
          text-text-primary
          placeholder:text-text-secondary
          focus:outline-none
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      />
    </div>
  )
}

export default HeaderSearch