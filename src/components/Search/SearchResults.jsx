import React, { useState } from 'react';
import {
  View,
  Card,
  Flex,
  Text,
  Button,
  Badge,
  Image,
  Divider,
  Heading
} from '@aws-amplify/ui-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePrivacy } from '../../contexts/PrivacyContext';

const SearchResults = ({ 
  results = [], 
  searchQuery = '', 
  onResultClick,
  onViewMoment,
  onViewStory,
  onViewUser,
  showResultType = true,
  groupByType = true
}) => {
  const { user } = useAuth();
  const { canViewMoment, canViewStory } = usePrivacy();

  const [expandedResults, setExpandedResults] = useState({});

  // Group results by type
  const groupedResults = groupByType ? groupResultsByType(results) : { all: results };

  // Highlight search terms in text
  const highlightText = (text, query) => {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  // Group results by type
  function groupResultsByType(results) {
    return results.reduce((groups, result) => {
      const type = result.type || 'unknown';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
      return groups;
    }, {});
  }

  // Get type display name
  const getTypeDisplayName = (type) => {
    const typeNames = {
      moment: 'Moments',
      story: 'Stories',
      user: 'Family Members',
      all: 'All Results'
    };
    return typeNames[type] || type;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    const typeIcons = {
      moment: '📸',
      story: '📖',
      user: '👤',
      all: '🔍'
    };
    return typeIcons[type] || '📄';
  };

  // Handle result click
  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default behavior based on result type
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
          console.log('Clicked result:', result);
      }
    }
  };

  // Check if user can view result
  const canViewResult = (result) => {
    switch (result.type) {
      case 'moment':
        return canViewMoment(result, user?.id);
      case 'story':
        return canViewStory(result, user?.id);
      case 'user':
        return true; // Users are generally viewable
      default:
        return true;
    }
  };

  // Toggle expanded view for result
  const toggleExpanded = (resultId) => {
    setExpandedResults(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };

  // Render individual result
  const renderResult = (result) => {
    const canView = canViewResult(result);
    const isExpanded = expandedResults[result.id];

    return (
      <Card 
        key={result.id} 
        className={`search-result-item ${!canView ? 'restricted' : ''}`}
        onClick={() => canView && handleResultClick(result)}
      >
        <View padding="medium">
          <Flex direction="row" gap="medium" alignItems="flex-start">
            {/* Result Icon/Image */}
            <View className="result-icon">
              {result.imageUrl ? (
                <Image
                  src={result.imageUrl}
                  alt={result.title || result.name}
                  width="60px"
                  height="60px"
                  objectFit="cover"
                  borderRadius="8px"
                />
              ) : (
                <div className="result-type-icon">
                  {getTypeIcon(result.type)}
                </div>
              )}
            </View>

            {/* Result Content */}
            <View flex="1">
              <Flex direction="column" gap="small">
                {/* Title/Name */}
                <Flex direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Heading level={6} className="result-title">
                    {highlightText(result.title || result.name || 'Untitled', searchQuery)}
                  </Heading>
                  
                  <Flex direction="row" gap="small" alignItems="center">
                    {showResultType && (
                      <Badge variation="info" size="small">
                        {getTypeDisplayName(result.type)}
                      </Badge>
                    )}
                    {!canView && (
                      <Badge variation="warning" size="small">
                        🔒 Private
                      </Badge>
                    )}
                  </Flex>
                </Flex>

                {/* Description */}
                {result.description && (
                  <Text fontSize="small" color="neutral.80" className="result-description">
                    {isExpanded 
                      ? highlightText(result.description, searchQuery)
                      : highlightText(
                          result.description.length > 150 
                            ? result.description.substring(0, 150) + '...'
                            : result.description,
                          searchQuery
                        )
                    }
                  </Text>
                )}

                {/* Metadata */}
                <Flex direction="row" gap="medium" alignItems="center" wrap="wrap">
                  {result.date && (
                    <Text fontSize="small" color="neutral.60">
                      📅 {new Date(result.date).toLocaleDateString()}
                    </Text>
                  )}
                  
                  {result.user && (
                    <Text fontSize="small" color="neutral.60">
                      👤 {result.user.name} {result.user.lastName}
                    </Text>
                  )}
                  
                  {result.memberCount && (
                    <Text fontSize="small" color="neutral.60">
                      👥 {result.memberCount} members
                    </Text>
                  )}
                  
                  {result.role && (
                    <Badge variation="neutral" size="small">
                      {result.role}
                    </Badge>
                  )}
                </Flex>

                {/* Tags */}
                {result.tags && result.tags.length > 0 && (
                  <Flex direction="row" gap="small" wrap="wrap">
                    {result.tags.map((tag, index) => (
                      <Badge key={index} variation="neutral" size="small" className="tag-badge">
                        #{highlightText(tag, searchQuery)}
                      </Badge>
                    ))}
                  </Flex>
                )}

                {/* Actions */}
                <Flex direction="row" gap="small" marginTop="small">
                  {canView && (
                    <Button
                      size="small"
                      variation="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResultClick(result);
                      }}
                    >
                      View {getTypeDisplayName(result.type).slice(0, -1)}
                    </Button>
                  )}
                  
                  {result.description && result.description.length > 150 && (
                    <Button
                      size="small"
                      variation="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(result.id);
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </Flex>
              </Flex>
            </View>
          </Flex>
        </View>
      </Card>
    );
  };

  // Render results by type
  const renderResultGroup = (type, typeResults) => {
    if (typeResults.length === 0) return null;

    return (
      <View key={type} className="result-group">
        {groupByType && Object.keys(groupedResults).length > 1 && (
          <>
            <Flex direction="row" alignItems="center" gap="small" marginBottom="medium">
              <Text fontSize="large" fontWeight="bold" color="neutral.80">
                {getTypeIcon(type)} {getTypeDisplayName(type)}
              </Text>
              <Badge variation="info">{typeResults.length}</Badge>
            </Flex>
          </>
        )}
        
        <Flex direction="column" gap="medium">
          {typeResults.map(renderResult)}
        </Flex>
        
        {groupByType && Object.keys(groupedResults).length > 1 && (
          <Divider marginTop="large" marginBottom="medium" />
        )}
      </View>
    );
  };

  if (results.length === 0) {
    return (
      <View className="search-results empty">
        <Card>
          <View padding="large" textAlign="center">
            <Text fontSize="large" color="neutral.60" marginBottom="small">
              🔍 No results found
            </Text>
            <Text color="neutral.60">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
                : 'Start typing to search through your family memories.'
              }
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View className="search-results">
      <Flex direction="column" gap="medium">
        {/* Results Summary */}
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Text fontSize="medium" fontWeight="semibold" color="neutral.80">
            {results.length} result{results.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </Text>
          
          {groupByType && Object.keys(groupedResults).length > 1 && (
            <Flex direction="row" gap="small">
              {Object.entries(groupedResults).map(([type, typeResults]) => (
                <Badge key={type} variation="neutral" size="small">
                  {getTypeIcon(type)} {typeResults.length}
                </Badge>
              ))}
            </Flex>
          )}
        </Flex>

        {/* Results */}
        {Object.entries(groupedResults).map(([type, typeResults]) => 
          renderResultGroup(type, typeResults)
        )}
      </Flex>
    </View>
  );
};

export default SearchResults;