import React from 'react';
import amplifyConfig from '../aws-exports.js';

const AWSLinksPage = () => {
  const region = amplifyConfig.aws_appsync_region || amplifyConfig.aws_project_region || 'ap-southeast-2';
  const appSyncEndpoint = amplifyConfig.aws_appsync_graphqlEndpoint || '';
  const userPoolId = amplifyConfig.aws_user_pools_id || amplifyConfig.Auth?.userPoolId || '';
  const identityPoolId = amplifyConfig.aws_cognito_identity_pool_id || '';
  const s3Bucket = amplifyConfig.aws_user_files_s3_bucket || amplifyConfig.Storage?.AWSS3?.bucket || '';

  // Extract AppSync API ID from endpoint: https://<id>.appsync-api.<region>.amazonaws.com/graphql
  let appSyncApiId = '';
  try {
    const match = appSyncEndpoint.match(/^https:\/\/([^\.]+)\.appsync-api\.[^\.]+\.amazonaws\.com\/graphql$/);
    appSyncApiId = match ? match[1] : '';
  } catch (_) {}

  const links = [
    {
      label: 'Amplify Console',
      url: `https://${region}.console.aws.amazon.com/amplify/home?region=${region}`
    },
    {
      label: 'AppSync Console (API)',
      url: appSyncApiId
        ? `https://${region}.console.aws.amazon.com/appsync/home?region=${region}#/apis/${appSyncApiId}`
        : `https://${region}.console.aws.amazon.com/appsync/home?region=${region}`
    },
    {
      label: 'DynamoDB Tables',
      url: `https://${region}.console.aws.amazon.com/dynamodbv2/home?region=${region}#tables:`
    },
    {
      label: 'S3 Bucket (Media)',
      url: s3Bucket
        ? `https://s3.console.aws.amazon.com/s3/buckets/${s3Bucket}?region=${region}&tab=objects`
        : `https://s3.console.aws.amazon.com/s3/home?region=${region}`
    },
    {
      label: 'Cognito User Pool',
      url: userPoolId
        ? `https://${region}.console.aws.amazon.com/cognito/v2/idp/user-pools/${userPoolId}?region=${region}`
        : `https://${region}.console.aws.amazon.com/cognito/v2/home?region=${region}`
    },
    {
      label: 'Cognito Identity Pool',
      url: identityPoolId
        ? `https://${region}.console.aws.amazon.com/cognito/v2/identity/identity-pools/${identityPoolId}?region=${region}`
        : `https://${region}.console.aws.amazon.com/cognito/v2/identity/home?region=${region}`
    }
  ];

  const InfoRow = ({ name, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #E7E7E7' }}>
      <span style={{ color: '#64748B' }}>{name}</span>
      <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="amw-card p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">AWS Links</h1>
        <p className="text-gray-600 mb-6">Quick access to your backend resources based on current Amplify config.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="amw-card p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Configuration</h2>
            <InfoRow name="Region" value={region} />
            <InfoRow name="AppSync API ID" value={appSyncApiId} />
            <InfoRow name="AppSync Endpoint" value={appSyncEndpoint} />
            <InfoRow name="Cognito User Pool ID" value={userPoolId} />
            <InfoRow name="Identity Pool ID" value={identityPoolId} />
            <InfoRow name="S3 Bucket" value={s3Bucket} />
          </div>

          <div className="amw-card p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-3">AWS Console</h2>
            <div className="space-y-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-800"
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>🔗</span>
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Note: For DynamoDB table names, open AppSync → Data sources to find linked tables.
        </div>
      </div>
    </div>
  );
};

export default AWSLinksPage;
