/**
 * FORM_INPUT.TSX - Reusable input field komponenta
 * 
 * EKSTRAHIRANO IZ: profile/page.tsx
 * RAZLOG: DRY princip - formulari se ponavljajo
 * 
 * FUNKCIONALNOSTI:
 * - Konsistenten stil za vse input polja
 * - Priložena label
 * - Opcijska napaka sporočila
 * - Prilagodljiv za text, email, itd.
 * 
 * PROPS:
 * @param label - Besedilo etikete
 * @param value - Trenutna vrednost input-a
 * @param onChange - Callback ob spremembi
 * @param disabled - Ali je input onemogočen
 * @param error - Napaka (prikazano v rdečem)
 * @param type - HTML input type
 */

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}

export default function FormInput({
  label,
  value,
  onChange,
  disabled = false,
  error,
  type = 'text',
}: FormInputProps) {
  return (
    <div>
      {/* LABEL */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* INPUT POLJE */}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-lg border
          transition-colors duration-200
          ${
            disabled
              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
              : error
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:outline-none'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          }
        `}
        aria-label={label}
        aria-invalid={!!error}
      />

      {/* NAPAKA SPOROČILO */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
