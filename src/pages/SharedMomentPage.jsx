import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Card, Flex, Text, View, Button } from '@aws-amplify/ui-react';

const SharedMomentPage = () => {
  const { id } = useParams();
  const [moment, setMoment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const m = await API.getMoment(id);
        if (!m) {
          setError('Moment not found');
        }
        // Enforce public visibility for shared links
        if (m && (m.visibility === 'PUBLIC' || m.isPublic === true)) {
          setMoment(m);
        } else {
          setMoment(null);
          setError('This moment is not publicly viewable.');
        }
      } catch (e) {
        console.error('Error loading moment', e);
        setError('Failed to load moment');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View className="shared-moment-page">
        <Flex justifyContent="center" padding="2rem">
          <Text>Loading...</Text>
        </Flex>
      </View>
    );
  }

  if (error || !moment) {
    return (
      <View className="shared-moment-page">
        <Flex direction="column" alignItems="center" gap="1rem" padding="2rem">
          <Text variation="error">{error || 'Moment not available'}</Text>
          <Link to="/">
            <Button variation="primary">Go Home</Button>
          </Link>
        </Flex>
      </View>
    );
  }

  const imageUrl = moment?.media?.imageUrl || moment?.imageUrl;
  const videoUrl = moment?.media?.videoUrl || moment?.videoUrl;

  return (
    <View className="shared-moment-page">
      <Card className="shared-moment-card">
        <Flex direction="column" gap="1rem">
          <Text as="h1" fontSize="1.5rem" fontWeight="700">{moment.title || 'Untitled Moment'}</Text>
          {imageUrl && (
            <img src={imageUrl} alt={moment.title} style={{ width: '100%', borderRadius: 12 }} />
          )}
          {videoUrl && (
            <video src={videoUrl} controls style={{ width: '100%', borderRadius: 12 }} />
          )}
          {moment.description && (
            <Text>{moment.description}</Text>
          )}
        </Flex>
      </Card>
    </View>
  );
};

export default SharedMomentPage;
