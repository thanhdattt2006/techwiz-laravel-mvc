import React, { useState, useEffect, useMemo } from 'react';
import { AnnouncementBanner } from '../../components/common';
import {
  HomeHeroSection,
  HomeFeaturedMarkets,
  HomeFreshHarvest,
  HomeHowItWorks,
  HomeCommunitySpotlight,
  FALLBACK_MARKETS,
  FALLBACK_HARVEST,
} from '../../components/home';
import { marketApi, productApi, categoryApi } from '../../api';

/**
 * HomePage Component
 * Landing page connecting shoppers with local farmers markets and fresh harvest.
 * Cleanly separated into modular sub-components adhering to SOLID principles.
 */
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortByPrice, setSortByPrice] = useState('default');

  const [markets, setMarkets] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState([]);

  // Fetch Markets from Live API
  useEffect(() => {
    let isMounted = true;
    const loadMarkets = async () => {
      try {
        const res = await marketApi.getMarkets();
        if (isMounted) {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setMarkets(list.length > 0 ? list.slice(0, 3) : FALLBACK_MARKETS);
        }
      } catch {
        if (isMounted) setMarkets(FALLBACK_MARKETS);
      } finally {
        if (isMounted) setLoadingMarkets(false);
      }
    };
    loadMarkets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products & Categories from Live API
  useEffect(() => {
    let isMounted = true;
    const loadProductsAndCategories = async () => {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productApi.getProducts({ in_stock: 1 }),
          categoryApi.getCategories(),
        ]);

        if (isMounted) {
          if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
            const list = Array.isArray(prodRes.value.data)
              ? prodRes.value.data
              : prodRes.value.data?.data || [];
            setProducts(list.length > 0 ? list : FALLBACK_HARVEST);
          } else {
            setProducts(FALLBACK_HARVEST);
          }

          if (catRes.status === 'fulfilled' && catRes.value?.data) {
            const list = Array.isArray(catRes.value.data)
              ? catRes.value.data
              : catRes.value.data?.data || [];
            setCategories(list);
          }
        }
      } catch {
        if (isMounted) setProducts(FALLBACK_HARVEST);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };
    loadProductsAndCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and Sort produce
  const filteredHarvest = useMemo(() => {
    return products
      .filter((item) => {
        const itemName = (item.name || '').toLowerCase();
        const farmName = (item.farmer?.stall_name || item.farmOrigin || item.farm || '').toLowerCase();
        const marketName = (item.farmer?.markets?.[0]?.name || item.marketName || item.market || '').toLowerCase();
        const term = searchTerm.toLowerCase().trim();

        const matchSearch =
          term === '' ||
          itemName.includes(term) ||
          farmName.includes(term) ||
          marketName.includes(term);

        const catName = (typeof item.category === 'object' ? item.category?.name : item.category) || '';
        const catSlug = (typeof item.category === 'object' ? item.category?.slug : '') || '';

        const matchCat =
          selectedCategory === 'ALL' ||
          catName.toUpperCase() === selectedCategory.toUpperCase() ||
          catSlug.toUpperCase() === selectedCategory.toUpperCase();

        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        if (sortByPrice === 'asc') return priceA - priceB;
        if (sortByPrice === 'desc') return priceB - priceA;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortByPrice]);

  return (
    <div className="space-y-16 pb-20 font-sans antialiased text-[#0F172A]">
      <AnnouncementBanner />
      <HomeHeroSection />
      <HomeFeaturedMarkets markets={markets} loading={loadingMarkets} />
      <HomeFreshHarvest
        products={filteredHarvest}
        categories={categories}
        loading={loadingProducts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortByPrice={sortByPrice}
        onSortByPriceChange={setSortByPrice}
      />
      <HomeHowItWorks />
      <HomeCommunitySpotlight />
    </div>
  );
}
