import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productApi, reviewApi, favoriteApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';

/**
 * Custom Hook: useProductDetail
 * Encapsulates single produce item data retrieval, live reviews, customer bookmarking,
 * and cart additions, adhering strictly to S.O.L.I.D principles.
 *
 * @param {string|number} productId - Target produce ID from router params
 */
export function useProductDetail(productId) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showAlert, showConfirm } = useModal();
  const { addToCart: addCartItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [submittingCart, setSubmittingCart] = useState(false);

  // 1. Fetch Product Details and Reviews
  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    try {
      const [productRes, reviewsRes] = await Promise.allSettled([
        productApi.getProduct(productId),
        reviewApi.getProductReviews(productId),
      ]);

      if (productRes.status === 'fulfilled' && productRes.value?.data) {
        const prodData = productRes.value.data?.data || productRes.value.data;
        setProduct(prodData);

        // Reset initial quantity to 1 if available, or 0 if sold out
        const availableStock = Number(prodData.stock_quantity) || 0;
        setQuantity(availableStock > 0 ? 1 : 0);
      } else {
        const errorMsg =
          productRes.status === 'rejected'
            ? productRes.reason?.response?.data?.message || 'Produce item not found.'
            : 'Produce item not found.';
        setError(errorMsg);
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data) {
        const revList = Array.isArray(reviewsRes.value.data)
          ? reviewsRes.value.data
          : reviewsRes.value.data?.data || [];
        setReviews(revList);
      } else if (productRes.status === 'fulfilled' && productRes.value?.data?.reviews) {
        // Fallback to eager-loaded reviews on product resource
        setReviews(productRes.value.data.reviews);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load produce details.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // 2. Fetch Favorite status if customer is authenticated
  useEffect(() => {
    let isMounted = true;

    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !productId) return;
      try {
        const res = await favoriteApi.getFavorites({ type: 'product' });
        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          const matched = list.some(
            (fav) => Number(fav.target_id || fav.product_id || fav.id) === Number(productId)
          );
          setIsFavorite(matched);
        }
      } catch {
        // Graceful fallback on bookmark fetch
      }
    };

    fetchProductData();
    checkFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [productId, isAuthenticated, fetchProductData]);

  // Quantity controllers
  const maxStock = Number(product?.stock_quantity) || 0;

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  }, [maxStock]);

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const setCustomQuantity = useCallback(
    (val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1) {
        setQuantity(1);
      } else if (parsed > maxStock) {
        setQuantity(maxStock);
      } else {
        setQuantity(parsed);
      }
    },
    [maxStock]
  );

  // 3. Toggle Favorite Heart
  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      const confirmed = await showConfirm({
        title: 'Sign In Required',
        message: 'Please sign in to save fresh harvests to your personal favorites wishlist.',
        type: 'info',
        confirmText: 'Sign In Now',
        cancelText: 'Stay as Guest',
      });
      if (confirmed) {
        navigate('/login', { state: { from: location } });
      }
      return;
    }

    try {
      const prev = isFavorite;
      setIsFavorite(!prev);
      const res = await favoriteApi.toggleFavorite('product', productId);
      if (res?.data?.is_favorited !== undefined) {
        setIsFavorite(res.data.is_favorited);
      }
    } catch (err) {
      setIsFavorite((prev) => !prev);
      showAlert({
        title: 'Action Failed',
        message: err?.response?.data?.message || 'Unable to update bookmark status.',
        type: 'danger',
      });
    }
  }, [isAuthenticated, isFavorite, productId, showAlert, showConfirm, navigate, location]);

  // 4. Add to Cart via Global CartContext
  const addToCart = useCallback(async () => {
    if (!product) return false;

    if (maxStock <= 0) {
      showAlert({
        title: 'Item Out of Stock',
        message: 'This harvest batch is currently sold out. Please check back for the upcoming market session.',
        type: 'warning',
      });
      return false;
    }

    if (quantity <= 0) {
      showAlert({
        title: 'Invalid Quantity',
        message: 'Please select at least 1 unit to add to your basket.',
        type: 'warning',
      });
      return false;
    }

    setSubmittingCart(true);
    try {
      const ok = await addCartItem(product.id, quantity);
      if (ok) {
        openCart();
      }
      return ok;
    } finally {
      setSubmittingCart(false);
    }
  }, [product, maxStock, quantity, addCartItem, openCart, showAlert]);

  return {
    product,
    reviews,
    loading,
    error,
    quantity,
    maxStock,
    isFavorite,
    submittingCart,
    increaseQuantity,
    decreaseQuantity,
    setCustomQuantity,
    toggleFavorite,
    addToCart,
    refetch: fetchProductData,
  };
}

export default useProductDetail;
