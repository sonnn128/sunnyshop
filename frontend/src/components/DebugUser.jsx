import React from 'react';
import { Card, Typography, Button } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getTokenInfo } from '../utils/jwt.js';

const { Title, Text, Paragraph } = Typography;

const DebugUser = () => {
  const { user, loading, isAdmin } = useAuth();

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const jwtInfo = getTokenInfo(localStorage.getItem('token'));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card style={{ margin: 16, backgroundColor: '#f0f2f5' }}>
      <Title level={4}>Debug User Information</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>Loading: </Text>
        <Text>{loading ? 'Yes' : 'No'}</Text>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>User: </Text>
        <pre style={{ backgroundColor: '#fff', padding: 8, borderRadius: 4 }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>Is Admin: </Text>
        <Text style={{ color: isAdmin() ? 'green' : 'red' }}>
          {isAdmin() ? 'Yes' : 'No'}
        </Text>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>Local Storage Token: </Text>
        <Text code>{localStorage.getItem('token') ? 'Present' : 'Not found'}</Text>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong>Local Storage User: </Text>
        <Text code>{localStorage.getItem('user') ? 'Present' : 'Not found'}</Text>
      </div>
      
      {jwtInfo && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>JWT Token Info: </Text>
          <div style={{ marginTop: 8 }}>
            <Text strong>Expired: </Text>
            <Text style={{ color: jwtInfo.isExpired ? 'red' : 'green' }}>
              {jwtInfo.isExpired ? 'Yes' : 'No'}
            </Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text strong>Expires At: </Text>
            <Text>{jwtInfo.expiresAt}</Text>
          </div>
          <div style={{ marginTop: 8 }}>
            <Text strong>JWT Payload: </Text>
            <pre style={{ backgroundColor: '#fff', padding: 8, borderRadius: 4, marginTop: 4 }}>
              {JSON.stringify(jwtInfo.payload, null, 2)}
            </pre>
          </div>
          {jwtInfo.payload?.authorities && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Authorities: </Text>
              <Text style={{ color: jwtInfo.payload.authorities.includes('ADMIN') ? 'green' : 'red' }}>
                {JSON.stringify(jwtInfo.payload.authorities)}
              </Text>
            </div>
          )}
        </div>
      )}
      
      <Button type="primary" danger onClick={handleClearStorage}>
        Clear Storage & Reload
      </Button>
    </Card>
  );
};

export default DebugUser;
