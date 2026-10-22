import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface CustomSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: (SelectOption | string | number)[];
  placeholder?: string;
  icon?: string;
  variant?: 'pill' | 'form';
  compactOnMobile?: boolean;
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  disabled?: boolean;
  isActiveHighlight?: boolean;
  title?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  variant = 'form',
  compactOnMobile = false,
  className = '',
  menuClassName = '',
  align = 'left',
  disabled = false,
  isActiveHighlight,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options into { value, label, icon }
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as SelectOption;
    }
    return {
      value: opt,
      label: String(opt),
    };
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder || String(value || '');

  // Determine active highlight (e.g. for filter pills when value !== 'all' and value !== 'newest')
  const isHighlighted =
    typeof isActiveHighlight === 'boolean'
      ? isActiveHighlight
      : value !== 'all' && value !== 'newest' && value !== '' && value !== undefined;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${variant === 'pill' ? 'flex-1 sm:flex-none' : 'w-full'} ${className}`}
    >
      {/* ─── TRIGGER BUTTON ─── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        title={title || displayLabel}
        className={`w-full transition-all focus:outline-none flex items-center justify-between text-left ${
          variant === 'pill'
            ? `h-11 sm:h-10 px-3 sm:px-3.5 rounded-xl border bg-white shadow-2xs ${
                isHighlighted
                  ? 'border-brand-700 bg-brand-50/40 text-brand-900 font-semibold'
                  : 'border-stone-200 text-stone-700 hover:border-stone-300'
              } ${compactOnMobile ? 'justify-center sm:justify-start gap-2' : 'gap-2'}`
            : `px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-800 shadow-2xs hover:border-stone-400 focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 ${
                isOpen ? 'border-brand-800 ring-2 ring-brand-800/20' : 'border-stone-300'
              }`
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-stone-100' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <i
              className={`fa-solid ${icon} text-brand-800 shrink-0 ${
                variant === 'pill' ? 'text-xs sm:text-sm' : 'text-sm'
              }`}
            ></i>
          )}
          <span
            className={`truncate ${
              variant === 'pill' && compactOnMobile
                ? 'hidden sm:inline text-xs sm:text-sm max-w-[130px] lg:max-w-none'
                : 'text-xs sm:text-sm'
            }`}
          >
            {displayLabel}
          </span>
        </div>

        {/* Chevron Icon */}
        <i
          className={`fa-solid fa-chevron-down shrink-0 text-stone-400 transition-transform duration-200 ml-1.5 ${
            variant === 'pill' && compactOnMobile ? 'hidden sm:inline text-[10px]' : 'text-xs'
          } ${isOpen ? 'rotate-180 text-brand-800' : ''}`}
        ></i>

        {/* Mobile Indicator Dot (for compact filter pills) */}
        {variant === 'pill' && compactOnMobile && isHighlighted && (
          <span className="sm:hidden absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-700"></span>
        )}
      </button>

      {/* ─── THEMED FLOATING POPOVER MENU ─── */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 min-w-[200px] bg-white rounded-2xl border border-stone-200/90 shadow-2xl p-1.5 max-h-64 overflow-y-auto animate-scaleIn origin-top ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${variant === 'form' ? 'w-full' : 'w-auto'} ${menuClassName}`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d4cec2 #f5f4ef',
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-150 text-left my-0.5 ${
                  isSelected
                    ? 'bg-brand-900 text-white font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-brand-950 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {opt.icon && (
                    <i
                      className={`fa-solid ${opt.icon} text-xs ${
                        isSelected ? 'text-amber-200' : 'text-stone-400'
                      }`}
                    ></i>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                {isSelected && (
                  <i className="fa-solid fa-check text-gold-300 text-xs shrink-0 pl-2"></i>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
