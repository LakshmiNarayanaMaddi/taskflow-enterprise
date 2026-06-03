const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const base = `
    inline-flex items-center justify-center
    px-4 py-2 rounded-lg font-medium text-sm
    transition-all duration-200 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
    `,
    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2"
             viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12"
                  r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;