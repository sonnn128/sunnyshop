import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
          className="w-full pl-10 pr-20 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="w-8 h-8 rounded-full hover:bg-muted"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceSearch}
            className={`w-8 h-8 rounded-full hover:bg-muted ${
              isListening ? 'text-error animate-pulse' : 'text-muted-foreground'
            }`}
            disabled={isListening}
          >
            <Icon name="Mic" size={16} />
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="ml-1"
          >
            {isLoading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Search" size={16} />
            )}
          </Button>
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elegant z-50 max-h-96 overflow-y-auto"
        >
          {/* Auto-complete Suggestions */}
          {suggestions?.length > 0 && query && (
            <div className="p-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Gợi ý tìm kiếm
              </h4>
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-smooth flex items-center space-x-2"
                >
                  <Icon name="Search" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches?.length > 0 && (
            <div className="p-2 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Tìm kiếm gần đây
              </h4>
              {recentSearches?.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-smooth flex items-center space-x-2"
                >
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-2 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              Tìm kiếm phổ biến
            </h4>
            {popularSearches?.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-smooth flex items-center space-x-2"
              >
                <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{search}</span>
              </button>
            ))}
          </div>

          {/* Voice Search Tip */}
          <div className="p-3 border-t border-border bg-muted/50">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Mic" size={16} />
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