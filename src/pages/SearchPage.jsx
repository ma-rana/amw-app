import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Heading,
  Flex,
  Text,
  Button,
  Alert,
  Loader,
} from "@aws-amplify/ui-react";
import { Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AdvancedSearch from "../components/Search/AdvancedSearch";
import SearchResults from "../components/Search/SearchResults";
import { useResponsive } from "../hooks/useResponsive";

const SearchPage = ({
  onViewMoment,
  onViewStory,
  onViewUser,
  onNavigate,
  initialSearchQuery = "",
  initialSearchType = "all",
}) => {
  const { user: _user } = useAuth();
  const { isMobile } = useResponsive();

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Debounce timer for mobile search
  const searchTimeoutRef = useRef(null);

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
      const history = localStorage.getItem("amw_search_history");
      if (history) {
        const parsed = JSON.parse(history);
        setSearchHistory(parsed);
        setRecentSearches(parsed.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading search history:", err);
    }
  };

  // Load search suggestions
  const loadSearchSuggestions = () => {
    // Mock suggestions - in real app, this would come from API
    setSearchSuggestions([
      "Family vacation",
      "Birthday party",
      "Wedding photos",
      "Graduation day",
      "Holiday memories",
    ]);
  };

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setHasSearched(true);
    setIsSearching(false);
    setError(null);

    // Save to search history
    if (searchQuery.trim()) {
      const newHistory = [
        searchQuery.trim(),
        ...searchHistory.filter((s) => s !== searchQuery.trim()),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      setRecentSearches(newHistory.slice(0, 5));
      localStorage.setItem("amw_search_history", JSON.stringify(newHistory));
    }
  };

  // Handle search error
  const handleSearchError = (err) => {
    setError(err.message || "Search failed. Please try again.");
    setHasSearched(true);
    setIsSearching(false);
  };

  // Simple mobile search function
  const performMobileSearch = async (query) => {
    if (!query.trim()) {
      handleSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // This is a simplified version - in production, this would call your API
      // For now, returning empty results as the search will be handled by API integration later
      // The AdvancedSearch component handles the actual search logic
      const results = [];
      handleSearchResults(results);
    } catch (err) {
      handleSearchError(err);
    }
  };

  // Debounced mobile search handler
  const handleMobileSearchChange = (value) => {
    setSearchQuery(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If empty, clear results
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performMobileSearch(value);
    }, 300);
  };

  // Handle Enter key press to trigger search immediately
  const handleMobileSearchKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      // Clear any pending debounced search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Trigger search immediately
      if (searchQuery.trim()) {
        performMobileSearch(searchQuery);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    setRecentSearches([]);
    localStorage.removeItem("amw_search_history");
    setShowHistory(false);
  };

  // Safely get a display label from a recent search entry
  const getSearchLabel = (entry) => {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object") {
      // Prefer a 'query' field if present, otherwise fallback to a readable string
      if (typeof entry.query === "string" && entry.query.length > 0) return entry.query;
      try {
        // As a very last resort, stringify a compact summary
        const { query, type } = entry;
        return [query, type].filter(Boolean).join(" ") || "";
      } catch (_) {
        return "";
      }
    }
    return "";
  };

  return (
    <View className="min-h-screen bg-gray-50 py-6">
      <View className="amw-container">
        {/* Search Component at top */}
        <div className="mb-8">
          <AdvancedSearch
            onSearchResults={handleSearchResults}
            onSearchError={handleSearchError}
            onSearchStart={() => setIsSearching(true)}
            onSearchEnd={() => setIsSearching(false)}
            initialQuery={searchQuery}
            onQueryChange={setSearchQuery}
          />
        </div>

        {/* Header below search */}
        <div className="text-center mb-8">
          <Heading level={1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Search & Discover
          </Heading>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find moments, stories, and family members across your collection
          </Text>
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

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <div className="mt-6 lg:mt-8">
            <SearchResults
              results={searchResults}
              onViewMoment={onViewMoment}
              onViewStory={onViewStory}
              onViewUser={onViewUser}
            />
          </div>
        )}

        {/* Search Suggestions (when no search has been performed) */}
        {!hasSearched && !isSearching && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="amw-card p-6">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  className="mb-4"
                >
                  <Text className="text-lg font-semibold text-gray-800">
                    Recent Searches
                  </Text>
                  <Button
                    variation="link"
                    size="small"
                    onClick={clearSearchHistory}
                  >
                    Clear
                  </Button>
                </Flex>
                <Flex direction="row" wrap="wrap" gap="small">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variation="outlined"
                      size="small"
                      onClick={() => {
                        const label = getSearchLabel(search);
                        if (label) {
                          setSearchQuery(label);
                        }
                        // Trigger search
                      }}
                    >
                      {getSearchLabel(search) || "(unknown)"}
                    </Button>
                  ))}
                </Flex>
              </div>
            )}

            {/* Popular Searches */}
            <div className="amw-card p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Popular Searches
              </Text>
              <Flex direction="row" wrap="wrap" gap="small">
                {searchSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variation="outlined"
                    size="small"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      // Trigger search
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Flex>
            </div>

            {/* Quick Actions */}
            <div className="amw-card p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </Text>
              <Flex direction="column" gap="medium">
                <Button
                  variation="outlined"
                  onClick={() => onNavigate && onNavigate("/moments")}
                >
                  Browse All Moments
                </Button>
                <Button
                  variation="outlined"
                  onClick={() => onNavigate && onNavigate("/stories")}
                >
                  Explore Stories
                </Button>
                <Button
                  variation="outlined"
                  onClick={() => onNavigate && onNavigate("/family")}
                >
                  View Family Members
                </Button>
              </Flex>
            </div>
          </div>
        )}
      </View>
    </View>
  );
};

export default SearchPage;
