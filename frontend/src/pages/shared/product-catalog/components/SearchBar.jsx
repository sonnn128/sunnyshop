import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const SearchBar = ({ onSearch, onVoiceSearch, suggestions = [], isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const popularSearches = [
    'áo sơ mi nam',
    'váy công sở',
    'quần jeans nữ',
    'giày sneaker',
    'áo khoác mùa đông',
    'túi xách da'
  ];

  const recentSearches = [
    'áo thun basic',
    'chân váy midi',
    'giày cao gót'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef?.current &&
        !suggestionsRef?.current?.contains(event?.target) &&
        !inputRef?.current?.contains(event?.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
    setShowSuggestions(value?.length > 0 || true);
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery?.trim()) {
      onSearch(searchQuery?.trim());
      setShowSuggestions(false);
      inputRef?.current?.blur();
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript;
      setQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Có lỗi xảy ra khi nhận diện giọng nói');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition?.start();
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef?.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors duration-500 pb-2">
        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none mb-2">
          <Icon name="Search" size={24} className="text-slate-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="TÌM KIẾM SẢN PHẨM, THƯƠNG HIỆU..."
          className="w-full pl-12 pr-24 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 placeholder:text-xs placeholder:tracking-widest placeholder:uppercase focus:outline-none focus:ring-0 font-medium"
        />

        <div className="absolute inset-y-0 right-0 flex items-center mb-2">
          {query && (
            <button
              onClick={clearSearch}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          )}
          
          <button
            onClick={handleVoiceSearch}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              isListening ? 'text-error animate-pulse' : 'text-slate-400 hover:text-slate-900'
            }`}
            disabled={isListening}
          >
            <Icon name="Mic" size={18} />
          </button>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center text-slate-900 ml-1 hover:text-slate-600 transition-colors"
          >
            {isLoading ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <Icon name="ArrowRight" size={20} />
            )}
          </button>
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Auto-complete Suggestions */}
          {suggestions?.length > 0 && query && (
            <div className="p-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">
                Gợi ý tìm kiếm
              </h4>
              <div className="space-y-1">
                {suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors flex items-center space-x-3 text-sm text-slate-700 font-medium"
                  >
                    <Icon name="Search" size={14} className="text-slate-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches?.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">
                Tìm kiếm gần đây
              </h4>
              <div className="space-y-1">
                {recentSearches?.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors flex items-center space-x-3 text-sm text-slate-700"
                  >
                    <Icon name="Clock" size={14} className="text-slate-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">
              Tìm kiếm phổ biến
            </h4>
            <div className="space-y-1">
              {popularSearches?.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2.5 hover:bg-white transition-colors flex items-center space-x-3 text-sm text-slate-700"
                >
                  <Icon name="TrendingUp" size={14} className="text-slate-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Search Tip */}
          <div className="p-4 border-t border-slate-100 bg-slate-900 text-white">
            <div className="flex items-center space-x-3 text-[11px] font-light tracking-wide">
              <Icon name="Mic" size={14} className="text-white/70" />
              <span>Nhấn vào biểu tượng mic để tìm kiếm bằng giọng nói</span>
            </div>
          </div>
        </div>
      )}
      {/* Voice Search Indicator */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elegant p-4 z-50">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
            <span className="text-foreground">Đang nghe... Hãy nói từ khóa tìm kiếm</span>
            <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;