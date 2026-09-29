type Opcion = {
  id: number | string;
  nombre: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  opciones: Opcion[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function SelectField({
  id,
  label,
  opciones,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="flex min-w-48 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">{placeholder}</option>
        {opciones.map((op) => (
          <option key={op.id} value={op.id}>
            {op.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;