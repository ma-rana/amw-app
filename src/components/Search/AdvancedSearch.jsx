import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Card,
  Flex,
  Text,
  SearchField,
  SelectField,
  Button,
  Badge,
  Divider,
  CheckboxField,
  TextField,
  Loader,
  Alert
} from '@aws-amplify/ui-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePrivacy } from '../../contexts/PrivacyContext';


const AdvancedSearch = ({ 
  onSearchResults, 
  onSearchError,
  onSearchStart,
  onSearchEnd,
  onQueryChange,
  initialQuery = '',
  searchTypes = ['moments', 'stories', 'users'],
  placeholder = "Search across your family memories...",
  showFilters = true,
  autoSearch = true
}) => {
  const { user: _user } = useAuth();
  const { getUsersForPrivacy } = usePrivacy();

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [searchType, setSearchType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    tags: [],
    users: [],
    contentType: 'all', // all, text, image, video
    visibility: 'all', // all, public, private, family
    sortBy: 'relevance', // relevance, date, title
    sortOrder: 'desc'
  });

  // Available filter options
  const [availableTags, setAvailableTags] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Initialize from initialQuery and optionally auto-search
  useEffect(() => {
    if (typeof initialQuery === 'string') {
      setSearchQuery(initialQuery);
      if (autoSearch && initialQuery.trim()) {
        debouncedSearch(initialQuery, searchType, filters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const loadFilterOptions = async () => {
    try {
      // Load available users for filtering
      const users = await getUsersForPrivacy();
      setAvailableUsers(users);

      // Load available tags (this would come from your API)
      // For now, using mock data
      setAvailableTags([
        'family', 'vacation', 'birthday', 'holiday', 'milestone',
        'childhood', 'wedding', 'graduation', 'anniversary', 'travel'
      ]);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, type, currentFilters) => {
      if (!query.trim() && !hasActiveFilters(currentFilters)) {
        setSearchResults([]);
        onSearchResults && onSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);
      if (onSearchStart) {
        onSearchStart();
      }

      try {
        const results = await performSearch(query, type, currentFilters);
        setSearchResults(results);
        onSearchResults && onSearchResults(results);
      } catch (err) {
        const errorMessage = err.message || 'Search failed. Please try again.';
        setError(errorMessage);
        if (onSearchError) {
          onSearchError(err);
        }
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
        if (onSearchEnd) {
          onSearchEnd();
        }
      }
    }, 300),
    [onSearchResults, onSearchError]
  );

  // Perform search
  const performSearch = async (query, type, searchFilters) => {
    // This would integrate with your GraphQL API
    // For now, returning mock results
    const mockResults = {
      moments: [
        {
          id: '1',
          type: 'moment',
          title: 'Family Vacation 2023',
          description: 'Amazing trip to the beach with the whole family',
          date: '2023-07-15',
          tags: ['vacation', 'family'],
          user: { name: 'John', lastName: 'Doe' },
          imageUrl: '/api/placeholder/300/200'
        }
      ],
      stories: [
        {
          id: '2',
          type: 'story',
          title: 'Our Family History',
          description: 'The story of how our family came to be',
          date: '2023-01-01',
          memberCount: 5,
          user: { name: 'Jane', lastName: 'Smith' }
        }
      ],
      users: [
        {
          id: '3',
          type: 'user',
          name: 'Alice',
          lastName: 'Johnson',
          role: 'daughter',
          joinDate: '2023-03-15'
        }
      ]
    };

    // Filter results based on search type
    let results = [];
    if (type === 'all') {
      results = [...mockResults.moments, ...mockResults.stories, ...mockResults.users];
    } else {
      results = mockResults[type] || [];
    }

    // Apply filters
    results = applyFilters(results, searchFilters);

    // Apply search query
    if (query.trim()) {
      results = results.filter(item => 
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return results;
  };

  // Apply filters to results
  const applyFilters = (results, searchFilters) => {
    return results.filter(item => {
      // Date range filter
      if (searchFilters.dateRange.start || searchFilters.dateRange.end) {
        const itemDate = new Date(item.date);
        if (searchFilters.dateRange.start && itemDate < new Date(searchFilters.dateRange.start)) {
          return false;
        }
        if (searchFilters.dateRange.end && itemDate > new Date(searchFilters.dateRange.end)) {
          return false;
        }
      }

      // Tags filter
      if (searchFilters.tags.length > 0) {
        if (!item.tags || !searchFilters.tags.some(tag => item.tags.includes(tag))) {
          return false;
        }
      }

      // Users filter
      if (searchFilters.users.length > 0) {
        const itemUserId = item.user?.id || item.id;
        if (!searchFilters.users.includes(itemUserId)) {
          return false;
        }
      }

      return true;
    });
  };

  // Check if any filters are active
  const hasActiveFilters = (searchFilters) => {
    return searchFilters.dateRange.start || 
           searchFilters.dateRange.end ||
           searchFilters.tags.length > 0 ||
           searchFilters.users.length > 0 ||
           searchFilters.contentType !== 'all' ||
           searchFilters.visibility !== 'all';
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (typeof onQueryChange === 'function') {
      onQueryChange(value);
    }
    if (autoSearch) {
      debouncedSearch(value, searchType, filters);
    }
  };

  // Sync with initialQuery prop
  useEffect(() => {
    if (initialQuery !== searchQuery && initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Handle search type change
  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    if (autoSearch) {
      debouncedSearch(searchQuery, value, filters);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (autoSearch) {
      debouncedSearch(searchQuery, searchType, newFilters);
    }
  };

  // Handle tag filter
  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  // Handle user filter
  const handleUserToggle = (userId) => {
    const newUsers = filters.users.includes(userId)
      ? filters.users.filter(u => u !== userId)
      : [...filters.users, userId];
    handleFilterChange('users', newUsers);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      tags: [],
      users: [],
      contentType: 'all',
      visibility: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    if (autoSearch) {
      debouncedSearch(searchQuery, searchType, clearedFilters);
    }
  };

  // Manual search trigger
  const handleSearch = () => {
    debouncedSearch(searchQuery, searchType, filters);
  };

  return (
    <Card className="advanced-search">
      <View padding="large">
        {/* Main Search */}
        <Flex direction="column" gap="medium">
          <Flex direction="row" gap="medium" alignItems="end">
            <View flex="1">
              <SearchField
                label="Search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                size="large"
              />
            </View>
            
            {searchTypes.length > 1 && (
              <SelectField
                label="Search in"
                value={searchType}
                onChange={(e) => handleSearchTypeChange(e.target.value)}
                width="150px"
              >
                <option value="all">All</option>
                {searchTypes.includes('moments') && <option value="moments">Moments</option>}
                {searchTypes.includes('stories') && <option value="stories">Stories</option>}
                {searchTypes.includes('users') && <option value="users">Users</option>}
              </SelectField>
            )}

            {!autoSearch && (
              <Button
                variation="primary"
                onClick={handleSearch}
                isLoading={isSearching}
                loadingText="Searching..."
              >
                Search
              </Button>
            )}
          </Flex>

          {/* Search Status */}
          {isSearching && (
            <Flex direction="row" alignItems="center" gap="small">
              <Loader size="small" />
              <Text fontSize="small" color="neutral.60">Searching...</Text>
            </Flex>
          )}

          {error && (
            <Alert variation="error" isDismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Filter Toggle */}
          {showFilters && (
            <Flex direction="row" justifyContent="space-between" alignItems="center">
              <Button
                variation="link"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                size="small"
              >
                {showAdvancedFilters ? '▼' : '▶'} Advanced Filters
                {hasActiveFilters(filters) && (
                  <Badge variation="info" marginLeft="small">
                    {filters.tags.length + filters.users.length + 
                     (filters.dateRange.start ? 1 : 0) + 
                     (filters.dateRange.end ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters(filters) && (
                <Button
                  variation="link"
                  onClick={clearFilters}
                  size="small"
                  color="red"
                >
                  Clear Filters
                </Button>
              )}
            </Flex>
          )}

          {/* Advanced Filters */}
          {showFilters && showAdvancedFilters && (
            <>
              <Divider />
              <View className="advanced-filters">
                <Flex direction="column" gap="medium">
                  {/* Date Range */}
                  <View>
                    <Text fontWeight="semibold" marginBottom="small">Date Range</Text>
                    <Flex direction="row" gap="medium">
                      <TextField
                        label="From"
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          start: e.target.value
                        })}
                      />
                      <TextField
                        label="To"
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          end: e.target.value
                        })}
                      />
                    </Flex>
                  </View>

                  {/* Tags */}
                  <View>
                    <Text fontWeight="semibold" marginBottom="small">Tags</Text>
                    <Flex direction="row" wrap="wrap" gap="small">
                      {availableTags.map(tag => (
                        <Badge
                          key={tag}
                          variation={filters.tags.includes(tag) ? "info" : "neutral"}
                          className={`tag-filter ${filters.tags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  </View>

                  {/* Users */}
                  <View>
                    <Text fontWeight="semibold" marginBottom="small">Family Members</Text>
                    <Flex direction="column" gap="small" maxHeight="150px" overflow="auto">
                      {availableUsers.map(user => (
                        <CheckboxField
                          key={user.id}
                          label={`${user.name} ${user.lastName}`}
                          checked={filters.users.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleUserToggle(user.id);
                            } else {
                              handleUserToggle(user.id);
                            }
                          }}
                        />
                      ))}
                    </Flex>
                  </View>

                  {/* Content Type & Visibility */}
                  <Flex direction="row" gap="medium">
                    <SelectField
                      label="Content Type"
                      value={filters.contentType}
                      onChange={(e) => handleFilterChange('contentType', e.target.value)}
                      flex="1"
                    >
                      <option value="all">All Content</option>
                      <option value="text">Text Only</option>
                      <option value="image">With Images</option>
                      <option value="video">With Videos</option>
                    </SelectField>

                    <SelectField
                      label="Visibility"
                      value={filters.visibility}
                      onChange={(e) => handleFilterChange('visibility', e.target.value)}
                      flex="1"
                    >
                      <option value="all">All</option>
                      <option value="public">Public</option>
                      <option value="family">Family Only</option>
                      <option value="private">Private</option>
                    </SelectField>
                  </Flex>

                  {/* Sort Options */}
                  <Flex direction="row" gap="medium">
                    <SelectField
                      label="Sort By"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      flex="1"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                    </SelectField>

                    <SelectField
                      label="Order"
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      flex="1"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </SelectField>
                  </Flex>
                </Flex>
              </View>
            </>
          )}

          {/* Search Results Summary */}
          {searchResults.length > 0 && (
            <>
              <Divider />
              <Text fontSize="small" color="neutral.60">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </Text>
            </>
          )}
        </Flex>
      </View>
    </Card>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default AdvancedSearch;
