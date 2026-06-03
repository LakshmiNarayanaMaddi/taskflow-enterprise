const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  register,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-colors duration-200
          ${error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-white hover:border-gray-400'}
        `}
        {...register}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
};

export default Input;