import React, { useState, useEffect } from 'react';
import {
  View,
  Heading,
  Flex,
  Text,
  Button,
  Alert,
  Loader
} from '@aws-amplify/ui-react';
import { useAuth } from '../contexts/AuthContext';
import AdvancedSearch from '../components/Search/AdvancedSearch';
import SearchResults from '../components/Search/SearchResults';
import { useResponsive } from '../hooks/useResponsive';

const SearchPage = ({ 
  onViewMoment, 
  onViewStory, 
  onViewUser,
  initialSearchQuery = '',
  initialSearchType: _initialSearchType = 'all'
}) => {
  const { user: _user } = useAuth();
  const { isMobile, isTablet: _isTablet } = useResponsive();
  
  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Search history
  const [searchHistory, setSearchHistory] = useState([]);
  const [_showHistory, setShowHistory] = useState(false);

  // Recent searches and suggestions
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Load search history and suggestions on mount
  useEffect(() => {
    loadSearchHistory();
    loadSearchSuggestions();
  }, []);

  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const history = localStorage.getItem('amw_search_history');
      if (history) {
        const parsedHistory = JSON.parse(history);
        setSearchHistory(parsedHistory.slice(0, 10)); // Keep last 10 searches
        setRecentSearches(parsedHistory.slice(0, 5)); // Show last 5 in suggestions
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  // Save search to history
  const saveSearchToHistory = (query, type, resultsCount) => {
    if (!query.trim()) return;

    const searchEntry = {
      query,
      type,
      resultsCount,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    try {
      const updatedHistory = [searchEntry, ...searchHistory.filter(h => h.query !== query)];
      const limitedHistory = updatedHistory.slice(0, 10);
      
      setSearchHistory(limitedHistory);
      setRecentSearches(limitedHistory.slice(0, 5));
      
      localStorage.setItem('amw_search_history', JSON.stringify(limitedHistory));
    } catch (err) {
      console.error('Error saving search history:', err);
    }
  };

  // Load search suggestions
  const loadSearchSuggestions = () => {
    // In a real app, these would come from your API
    const suggestions = [
      'family vacation',
      'birthday celebrations',
      'holiday memories',
      'childhood photos',
      'wedding moments',
      'graduation day',
      'anniversary',
      'travel adventures',
      'family gatherings',
      'milestone moments'
    ];
    setSearchSuggestions(suggestions);
  };

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setHasSearched(true);
    setError(null);
    
    // Save to search history if there's a query
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery, 'all', results.length);
    }
  };

  // Handle search error
  const handleSearchError = (errorMessage) => {
    setError(errorMessage);
    setSearchResults([]);
    setHasSearched(true);
  };

  // Handle result click
  const handleResultClick = (result) => {
    // Track click analytics here if needed
    console.log('Result clicked:', result);
    
    // Navigate based on result type
    switch (result.type) {
      case 'moment':
        onViewMoment && onViewMoment(result);
        break;
      case 'story':
        onViewStory && onViewStory(result);
        break;
      case 'user':
        onViewUser && onViewUser(result);
        break;
      default:
        console.log('Unknown result type:', result.type);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowHistory(false);
    // The AdvancedSearch component will handle the actual search
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchEntry) => {
    setSearchQuery(searchEntry.query);
    setShowHistory(false);
    // The AdvancedSearch component will handle the actual search
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    setRecentSearches([]);
    localStorage.removeItem('amw_search_history');
    setShowHistory(false);
  };

  return (
    <View className="min-h-screen bg-gray-50 py-6">
      <View className="amw-container">
        {/* Header */}
        <div className="text-center mb-8">
          <Heading level={1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Search & Discover
          </Heading>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find moments, stories, and family members across your collection
          </Text>
        </div>

        {/* Search Component */}
        <div className="amw-card p-6 mb-8">
          <AdvancedSearch
            onSearchResults={handleSearchResults}
            onSearchError={handleSearchError}
            onSearchStart={() => setIsSearching(true)}
            onSearchEnd={() => setIsSearching(false)}
            initialQuery={searchQuery}
            onQueryChange={setSearchQuery}
          />
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="flex justify-center items-center py-12">
            <Loader size="large" />
            <Text className="ml-4 text-gray-600">Searching...</Text>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variation="error" className="mb-6">
            <Text fontWeight="semibold">Search Error</Text>
            <Text>{error}</Text>
          </Alert>
        )}

        {/* Search Suggestions (when no search has been performed) */}
        {!hasSearched && !isSearching && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="amw-card p-6">
                <Flex justifyContent="space-between" alignItems="center" className="mb-4">
                  <Text className="text-lg font-semibold text-gray-800">
                    Recent Searches
                  </Text>
                  <Button
                    variation="link"
                    size="small"
                    onClick={clearSearchHistory}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Clear All
                  </Button>
                </Flex>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={search.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">🔍</span>
                        <div>
                          <Text className="font-medium text-gray-800">
                            {search.query}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {search.resultsCount} results • {new Date(search.timestamp).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                      <Button
                        variation="link"
                        size="small"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecentSearchClick(search);
                        }}
                      >
                        ↗
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="amw-card p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Popular Searches
              </Text>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.slice(0, isMobile ? 6 : 10).map((suggestion, index) => (
                  <Button
                    key={index}
                    variation="link"
                    size="small"
                    className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <div className="amw-card">
            <SearchResults
              results={searchResults}
              searchQuery={searchQuery}
              onResultClick={handleResultClick}
              onViewMoment={onViewMoment}
              onViewStory={onViewStory}
              onViewUser={onViewUser}
              showResultType={true}
              groupByType={true}
            />
          </div>
        )}

        {/* Quick Actions */}
        {!hasSearched && !isSearching && (
          <div className="amw-card p-6">
            <Text className="text-lg font-semibold text-gray-800 mb-6 text-center">
              Quick Actions
            </Text>
            <Flex 
              direction={isMobile ? "column" : "row"} 
              gap="medium" 
              justifyContent="center"
              className="space-y-4 lg:space-y-0 lg:space-x-4"
            >
              <Button
                variation="primary"
                onClick={() => handleSuggestionClick('recent moments')}
                className="btn-primary inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <span>📸</span>
                <span>Browse Recent Moments</span>
              </Button>
              <Button
                variation="primary"
                onClick={() => handleSuggestionClick('family stories')}
                className="btn-secondary inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <span>📖</span>
                <span>Explore Family Stories</span>
              </Button>
              <Button
                variation="primary"
                onClick={() => handleSuggestionClick('family members')}
                className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <span>👥</span>
                <span>Find Family Members</span>
              </Button>
            </Flex>
          </div>
        )}
      </View>
    </View>
  );
};

export default SearchPage;