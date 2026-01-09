import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';

export function MySubscriptions() {
  const navigate = useNavigate();
  const { loading, execute } = useAPI();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      const data = await billingAPI.getMySubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to cancel this subscription? You will retain access until the end of your billing period.')) {
      return;
    }

    try {
      await execute(
        () => billingAPI.cancelSubscription(subscriptionId),
        'Subscription canceled successfully!'
      );
      // Reload subscriptions
      loadSubscriptions();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (!price || !price.price_amount) return '-';
    return `${price.price_display}${price.interval_display ? ' ' + price.interval_display : ''}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      trialing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Trial' },
      canceled: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Canceled' },
      incomplete: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Incomplete' },
      past_due: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Past Due' },
      unpaid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unpaid' },
      revoked: { bg: 'bg-red-100', text: 'text-red-800', label: 'Revoked' },
    };

    const config = statusConfig[status] || statusConfig.incomplete;

    return (
      <span className={`inline-block px-3 py-1 ${config.bg} ${config.text} text-xs font-medium rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1 inline-block">
              My Subscriptions
            </h1>
            <p className="text-sm text-[#747474] mt-2">
              Manage your active subscriptions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Plans
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loadingSubscriptions ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-[#747474]">Loading subscriptions...</div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-[#747474] mb-4">You don't have any subscriptions yet</p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
              >
                Browse Plans
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="border border-[#D3D3D3] rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {/* Subscription Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#000000]">
                          {subscription.product?.name || 'Unknown Product'}
                        </h3>
                        {getStatusBadge(subscription.status)}
                      </div>
                      <p className="text-sm text-[#747474]">
                        {subscription.product?.description}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[#747474] mb-1">Price</p>
                      <p className="text-sm font-medium text-[#000000]">
                        {formatPrice(subscription.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#747474] mb-1">Status</p>
                      <p className="text-sm font-medium text-[#000000]">
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#747474] mb-1">Current Period End</p>
                      <p className="text-sm font-medium text-[#000000]">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#747474] mb-1">Cancel at Period End</p>
                      <p className="text-sm font-medium text-[#000000]">
                        {subscription.cancel_at_period_end ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {/* Cancellation Notice */}
                  {subscription.cancel_at_period_end && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        This subscription is scheduled to be canceled on{' '}
                        <strong>{formatDate(subscription.current_period_end)}</strong>
                      </p>
                    </div>
                  )}

                  {/* Checkout URL (for incomplete subscriptions) */}
                  {subscription.status === 'incomplete' && subscription.checkout_url && (
                    <div className="mb-4">
                      <a
                        href={subscription.checkout_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Complete Payment
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  {subscription.is_active && !subscription.cancel_at_period_end && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Canceling...' : 'Cancel Subscription'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
