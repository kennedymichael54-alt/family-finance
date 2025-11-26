import React, { useState, useEffect } from 'react';

// Note: This component requires the Plaid Link SDK
// Install with: npm install react-plaid-link
// You'll also need a backend to handle Plaid API calls

const PlaidIntegration = ({ onAccountsLinked }) => {
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([
    // Example data - in production, this would come from your backend
    {
      id: 1,
      institutionName: 'Chase Bank',
      accountName: 'Chase Checking',
      accountType: 'checking',
      mask: '1234',
      balance: 5423.18,
      lastSync: '2024-01-25T10:30:00',
      syncEnabled: true,
    },
  ]);
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [syncStatus, setSyncStatus] = useState({});

  // Generate Plaid Link Token (this should call your backend)
  const generateLinkToken = async () => {
    setIsLoading(true);
    try {
      // In production, call your backend endpoint
      // const response = await fetch('/api/plaid/create-link-token', {
      //   method: 'POST',
      // });
      // const data = await response.json();
      // setLinkToken(data.link_token);
      
      // Simulated response for demo
      setTimeout(() => {
        setLinkToken('link-sandbox-EXAMPLE-TOKEN');
        setIsLoading(false);
        setShowPlaidModal(true);
      }, 1000);
    } catch (error) {
      console.error('Error generating link token:', error);
      setIsLoading(false);
      alert('Failed to initialize bank connection. Please try again.');
    }
  };

  // Handle successful Plaid Link
  const handlePlaidSuccess = async (publicToken, metadata) => {
    setIsLoading(true);
    try {
      // In production, exchange public token for access token via your backend
      // const response = await fetch('/api/plaid/exchange-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ public_token: publicToken, metadata }),
      // });
      // const data = await response.json();
      
      // Simulated account data
      const newAccount = {
        id: Date.now(),
        institutionName: metadata.institution?.name || 'Bank',
        accountName: metadata.accounts[0]?.name || 'Account',
        accountType: metadata.accounts[0]?.subtype || 'checking',
        mask: metadata.accounts[0]?.mask || '0000',
        balance: 0,
        lastSync: new Date().toISOString(),
        syncEnabled: true,
      };

      setConnectedAccounts([...connectedAccounts, newAccount]);
      setShowPlaidModal(false);
      setIsLoading(false);
      
      if (onAccountsLinked) {
        onAccountsLinked([newAccount]);
      }
      
      alert('Bank account connected successfully!');
    } catch (error) {
      console.error('Error exchanging token:', error);
      setIsLoading(false);
      alert('Failed to connect bank account. Please try again.');
    }
  };

  // Sync transactions for an account
  const syncAccount = async (accountId) => {
    setSyncStatus({ ...syncStatus, [accountId]: 'syncing' });
    
    try {
      // In production, call your backend to fetch transactions
      // const response = await fetch(`/api/plaid/sync-transactions/${accountId}`, {
      //   method: 'POST',
      // });
      // const data = await response.json();
      
      // Simulated sync
      setTimeout(() => {
        setConnectedAccounts(connectedAccounts.map(acc =>
          acc.id === accountId
            ? { ...acc, lastSync: new Date().toISOString() }
            : acc
        ));
        setSyncStatus({ ...syncStatus, [accountId]: 'success' });
        
        setTimeout(() => {
          setSyncStatus({ ...syncStatus, [accountId]: null });
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Error syncing account:', error);
      setSyncStatus({ ...syncStatus, [accountId]: 'error' });
    }
  };

  // Toggle auto-sync for an account
  const toggleAutoSync = (accountId) => {
    setConnectedAccounts(connectedAccounts.map(acc =>
      acc.id === accountId
        ? { ...acc, syncEnabled: !acc.syncEnabled }
        : acc
    ));
  };

  // Disconnect account
  const disconnectAccount = async (accountId) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    
    try {
      // In production, call your backend to remove access
      // await fetch(`/api/plaid/remove-account/${accountId}`, {
      //   method: 'DELETE',
      // });
      
      setConnectedAccounts(connectedAccounts.filter(acc => acc.id !== accountId));
      alert('Account disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account. Please try again.');
    }
  };

  // Get account icon
  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking': return '💳';
      case 'savings': return '💰';
      case 'credit': return '🎫';
      case 'investment': return '📈';
      default: return '🏦';
    }
  };

  // Format last sync time
  const formatLastSync = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Connections</h1>
        <p className="text-gray-600">Connect your bank accounts for automatic transaction syncing</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Secure Bank Connection</h3>
            <p className="text-sm text-blue-800">
              We use Plaid, a trusted financial services platform, to securely connect your bank accounts. 
              Your credentials are never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Connect New Account Button */}
      <div className="mb-6">
        <button
          onClick={generateLinkToken}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {isLoading ? 'Loading...' : 'Connect Bank Account'}
        </button>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connected Accounts</h2>
          
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getAccountIcon(account.accountType)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {account.institutionName}
                    </h3>
                    <p className="text-gray-600">
                      {account.accountName} •••• {account.mask}
                    </p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                      {account.accountType}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last synced: {formatLastSync(account.lastSync)}</span>
                
                {syncStatus[account.id] === 'syncing' && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Syncing...
                  </span>
                )}
                
                {syncStatus[account.id] === 'success' && (
                  <span className="flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Synced
                  </span>
                )}
                
                {syncStatus[account.id] === 'error' && (
                  <span className="flex items-center gap-1 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Sync Failed
                  </span>
                )}
              </div>

              {/* Auto-sync Toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Automatic Sync</span>
                </div>
                <button
                  onClick={() => toggleAutoSync(account.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    account.syncEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      account.syncEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => syncAccount(account.id)}
                  disabled={syncStatus[account.id] === 'syncing'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sync Now
                </button>
                
                <button
                  onClick={() => setSelectedAccount(account)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Details
                </button>
                
                <button
                  onClick={() => disconnectAccount(account.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Connected Accounts</h3>
          <p className="text-gray-600 mb-6">
            Connect your first bank account to start automatic transaction syncing
          </p>
        </div>
      )}

      {/* Plaid Link Modal (Placeholder) */}
      {showPlaidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Bank</h2>
            <p className="text-gray-600 mb-6">
              In production, this would open the Plaid Link interface to securely connect your bank account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Click "Simulate Connection" to add a demo account.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPlaidModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePlaidSuccess('demo_token', {
                  institution: { name: 'Demo Bank' },
                  accounts: [{ name: 'Demo Checking', mask: '9999', subtype: 'checking' }],
                })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Simulate Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedAccount.accountName}</h2>
                <p className="text-gray-600">{selectedAccount.institutionName}</p>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium">•••• {selectedAccount.mask}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Account Type</span>
                <span className="font-medium capitalize">{selectedAccount.accountType}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-medium">
                  ${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Auto-Sync</span>
                <span className={`font-medium ${selectedAccount.syncEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                  {selectedAccount.syncEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Last Synced</span>
                <span className="font-medium">{formatLastSync(selectedAccount.lastSync)}</span>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Transaction history is automatically synced when enabled. 
                Manual sync is available at any time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Connect Your Bank</h4>
              <p className="text-sm text-gray-600">
                Securely connect your bank account through Plaid's trusted platform
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Automatic Sync</h4>
              <p className="text-sm text-gray-600">
                Your transactions are automatically imported and categorized daily
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-600">
                Your budget and financial insights update automatically with each sync
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Setup Note */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Backend Setup Required</h4>
            <p className="text-sm text-yellow-800">
              To use Plaid integration in production, you'll need to set up backend endpoints to handle:
              link token generation, public token exchange, transaction syncing, and webhook handling.
              Visit{' '}
              <a
                href="https://plaid.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Plaid's documentation
              </a>
              {' '}for implementation guides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidIntegration;
