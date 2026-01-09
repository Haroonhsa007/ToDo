import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, execute } = useAPI();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // Load products and subscription status on mount
  useEffect(() => {
    loadProducts();
    if (user) {
      loadSubscriptionStatus();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await billingAPI.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadSubscriptionStatus = async () => {
    try {
      const status = await billingAPI.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

  const handleSubscribe = async (productId, priceId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const data = await execute(
        () => billingAPI.createCheckout(productId, priceId),
        'Creating checkout session...'
      );

      if (data && data.checkout_url) {
        // Redirect to Polar checkout
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const formatPrice = (priceAmount) => {
    return `$${(priceAmount / 100).toFixed(2)}`;
  };

  const getPriceInterval = (price) => {
    if (price.type === 'one_time') return 'one-time';
    return `/${price.recurring_interval}`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1 inline-block">
              Subscription Plans
            </h1>
            <p className="text-sm text-[#747474] mt-2">
              Choose the plan that's right for you
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
          >
            Go Back
          </button>
        </div>

        {/* Current Subscription Status */}
        {subscriptionStatus && subscriptionStatus.has_active_subscription && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              You currently have an active subscription
            </p>
            <button
              onClick={() => navigate('/my-subscriptions')}
              className="text-sm text-green-700 underline mt-1"
            >
              Manage your subscriptions
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loadingProducts ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-[#747474]">Loading plans...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-[#747474] mb-4">No subscription plans available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#D3D3D3] rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow"
                >
                  {/* Product Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#000000] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#747474] line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Options */}
                  <div className="flex-1 mb-6">
                    {product.prices && product.prices.length > 0 ? (
                      product.prices.map((price) => (
                        <div
                          key={price.id}
                          className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0"
                        >
                          <div className="flex items-baseline mb-2">
                            <span className="text-3xl font-bold text-[#000000]">
                              {formatPrice(price.price_amount)}
                            </span>
                            <span className="text-[#747474] ml-2">
                              {getPriceInterval(price)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleSubscribe(product.id, price.id)}
                            disabled={loading || subscriptionStatus?.has_active_subscription}
                            className="w-full px-4 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {subscriptionStatus?.has_active_subscription
                              ? 'Already Subscribed'
                              : loading
                              ? 'Processing...'
                              : 'Subscribe Now'}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#747474]">No pricing available</p>
                    )}
                  </div>

                  {/* Product Type Badge */}
                  <div className="mt-auto">
                    <span className="inline-block px-3 py-1 bg-[#F5F5F5] text-[#747474] text-xs rounded-full">
                      {product.product_type === 'business' ? 'Business' : 'Individual'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
