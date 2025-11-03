import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';

const SearchOverlay = ({ open, onClose, onSubmit }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      // Focus input when overlay opens
      inputRef.current.focus();
    }
    if (open) {
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose && onClose();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      onSubmit && onSubmit(q);
      onClose && onClose();
    }
  };

  const overlay = (
    <div
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={`search-overlay ${open ? 'open' : ''}`}
    >
      <div className="search-overlay-backdrop" onClick={onClose} />
      <div className="search-overlay-panel" role="region">
        <form onSubmit={handleSubmit} className="search-overlay-form" aria-label="Search Form">
          <span className="search-overlay-icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            type="search"
            name="q"
            aria-label="Search across your family memories"
            placeholder="Search across your family memories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-overlay-input"
          />
          <button type="button" className="search-overlay-cancel" onClick={onClose} aria-label="Close search">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default SearchOverlay;

