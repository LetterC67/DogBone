import React from 'react';

function LanguageModal({ visible, langList, onLanguageSelect, onClose }) {
  return (
    <div
      onClick={onClose} // clicking on the overlay triggers close
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        transition-opacity duration-300 
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        bg-[rgba(17,7,12,0.7)] backdrop-blur-md
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
        className={`
          relative bg-[var(--secondary)] 
          rounded-lg shadow-lg 
          transform transition-all duration-300
          ${visible ? 'translate-y-0' : 'translate-y-4'}
        `}
      >
        <ul>
        {langList.map((item, index) => (
        <li
            key={item.lang}
            className="last:border-b-0 border-b border-[var(--divider)] first:rounded-t-lg last:rounded-b-lg"
        >
            <button
            onClick={() => onLanguageSelect(item)}
            className="w-full text-center px-4 py-2 transition-colors duration-200 hover:bg-[var(--accent-3)] text-[var(--primary)] px-6 hover:cursor-pointer"
            >
            {item.name}
            </button>
        </li>
        ))}

        </ul>
      </div>
    </div>
  );
}

export default LanguageModal;
