interface Option { value: string; label: string; }

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  label?: string;
}

export function Select({ value, onChange, options, label }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
