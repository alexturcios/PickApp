import { clx } from "@medusajs/ui"

export type CreateMode = "simple" | "advanced" | "bulk"

const MODES: { id: CreateMode; label: string; hint: string }[] = [
  {
    id: "simple",
    label: "Flujo Simple",
    hint: "4 campos y listo",
  },
  {
    id: "advanced",
    label: "Flujo Avanzado",
    hint: "Variantes e inventario",
  },
  {
    id: "bulk",
    label: "Carga Masiva",
    hint: "Sube tu Excel",
  },
]

type CreateModeSwitcherProps = {
  mode: CreateMode
  onChange: (mode: CreateMode) => void
}

/** Selector de los tres caminos de publicación. El Simple es el predeterminado. */
export const CreateModeSwitcher = ({
  mode,
  onChange,
}: CreateModeSwitcherProps) => {
  return (
    <div
      role="tablist"
      aria-label="Forma de subir tu producto"
      className="flex items-center gap-x-1"
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          role="tab"
          type="button"
          aria-selected={mode === m.id}
          onClick={() => onChange(m.id)}
          className={clx(
            "txt-compact-small transition-fg flex flex-col items-start rounded-md px-3 py-1 outline-none",
            mode === m.id
              ? "bg-ui-bg-base shadow-elevation-card-rest text-ui-fg-base font-medium"
              : "text-ui-fg-subtle hover:bg-ui-bg-base-hover"
          )}
        >
          <span>{m.label}</span>
          <span className="txt-compact-xsmall text-ui-fg-muted">{m.hint}</span>
        </button>
      ))}
    </div>
  )
}
