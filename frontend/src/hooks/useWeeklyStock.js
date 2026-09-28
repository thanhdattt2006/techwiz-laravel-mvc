import { useState, useEffect, useCallback } from 'react';
import { weeklyStockApi } from '../api/weeklyStockApi';
import { useModal } from '../context/ModalContext';

const DAYS_OF_WEEK = [
  { day_of_week: 0, day_name: 'Sunday' },
  { day_of_week: 1, day_name: 'Monday' },
  { day_of_week: 2, day_name: 'Tuesday' },
  { day_of_week: 3, day_name: 'Wednesday' },
  { day_of_week: 4, day_name: 'Thursday' },
  { day_of_week: 5, day_name: 'Friday' },
  { day_of_week: 6, day_name: 'Saturday' },
];

/**
 * useWeeklyStock (Phase 4.13)
 * Custom hook for managing recurring 7-day stock rollover templates
 * and executing 1-Click stock application for market sessions.
 */
export function useWeeklyStock(products = [], onStockApplied) {
  const { showAlert } = useModal();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [savingTemplates, setSavingTemplates] = useState(false);
  const [applyingWeekly, setApplyingWeekly] = useState(false);
  const [targetApplyDay, setTargetApplyDay] = useState(6); // Default Saturday market session

  // Auto-select first product if none selected
  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Load templates for selected product
  const loadTemplates = useCallback(async (prodId) => {
    if (!prodId) return;
    setLoadingTemplates(true);
    try {
      const res = await weeklyStockApi.getTemplates(prodId);
      const data = res?.data || res || [];
      const fetchedTemplates = Array.isArray(data) ? data : [];

      // Merge with all 7 days to guarantee complete weekly schedule
      const fullWeek = DAYS_OF_WEEK.map((day) => {
        const found = fetchedTemplates.find((t) => Number(t.day_of_week) === day.day_of_week);
        return {
          day_of_week: day.day_of_week,
          day_name: day.day_name,
          default_quantity: found ? Number(found.default_quantity || 0) : 0,
          is_active: found ? Boolean(found.is_active) : false,
        };
      });

      setTemplates(fullWeek);
    } catch {
      // Fallback empty week on error
      setTemplates(
        DAYS_OF_WEEK.map((d) => ({
          ...d,
          default_quantity: 0,
          is_active: false,
        }))
      );
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      loadTemplates(selectedProductId);
    }
  }, [selectedProductId, loadTemplates]);

  // Update specific day template
  const handleUpdateDay = (dayOfWeek, field, value) => {
    setTemplates((prev) =>
      prev.map((t) => (t.day_of_week === dayOfWeek ? { ...t, [field]: value } : t))
    );
  };

  // Save 7-day templates for product
  const handleSaveTemplates = async () => {
    if (!selectedProductId) return;
    setSavingTemplates(true);
    try {
      const payload = templates.map((t) => ({
        day_of_week: t.day_of_week,
        default_quantity: Math.max(0, Number(t.default_quantity || 0)),
        is_active: Boolean(t.is_active),
      }));

      await weeklyStockApi.updateTemplates(selectedProductId, payload);
      showAlert({
        title: 'Weekly Schedule Saved',
        message: 'Your 7-day harvest quota template has been saved.',
        type: 'success',
        autoCloseMs: 2000,
      });
    } catch (err) {
      showAlert({
        title: 'Save Failed',
        message: err?.response?.data?.message || 'Could not save weekly stock templates.',
        type: 'danger',
      });
    } finally {
      setSavingTemplates(false);
    }
  };

  // 1-Click Apply Weekly Stock for All Products
  const handleApplyWeeklyStock = async (overrideDay = null) => {
    const day = overrideDay !== null ? overrideDay : targetApplyDay;
    setApplyingWeekly(true);
    try {
      const res = await weeklyStockApi.applyWeeklyTemplates({ target_day: day });
      const info = res?.data || res;
      const count = info?.updated_products_count ?? 0;
      const dayName = info?.day_name || DAYS_OF_WEEK.find((d) => d.day_of_week === day)?.day_name;

      showAlert({
        title: 'Weekly Stock Applied!',
        message: `Successfully rolled over templates for ${dayName}. Updated ${count} produce listing(s) in your live public catalog.`,
        type: 'success',
      });

      if (onStockApplied) {
        onStockApplied();
      }
    } catch (err) {
      showAlert({
        title: 'Application Failed',
        message: err?.response?.data?.message || 'Could not apply weekly stock templates.',
        type: 'danger',
      });
    } finally {
      setApplyingWeekly(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  return {
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    templates,
    loadingTemplates,
    savingTemplates,
    applyingWeekly,
    targetApplyDay,
    setTargetApplyDay,
    handleUpdateDay,
    handleSaveTemplates,
    handleApplyWeeklyStock,
    DAYS_OF_WEEK,
    reloadTemplates: () => loadTemplates(selectedProductId),
  };
}
