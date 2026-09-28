import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../api/adminApi';
import { useModal } from '../context/ModalContext';

/**
 * useAdminUsers (Phase 4.15)
 * Custom hook for platform user accounts governance, search, filtering, and ban/unban actions.
 */
export function useAdminUsers() {
  const { showAlert, showConfirm } = useModal();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers();
      const list = res?.data || res || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not load users list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Derived filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role?.toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      if (statusFilter !== 'ALL' && u.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = u.fullname?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        const phoneMatch = u.phone?.toLowerCase().includes(q);
        const stallMatch = u.farmer?.stall_name?.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !phoneMatch && !stallMatch) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  const handleToggleStatus = (targetUser) => {
    const isBanned = targetUser.status === 'banned';
    const nextStatus = isBanned ? 'active' : 'banned';
    const actionLabel = isBanned ? 'Unban Account' : 'Ban Account';

    showConfirm({
      title: `${actionLabel}?`,
      message: isBanned
        ? `Restore platform access for "${targetUser.fullname}" (${targetUser.email})?`
        : `Are you sure you want to ban "${targetUser.fullname}" (${targetUser.email})? They will immediately lose platform access.`,
      confirmText: actionLabel,
      cancelText: 'Cancel',
      type: isBanned ? 'success' : 'danger',
      onConfirm: async () => {
        setActionLoadingId(targetUser.id);
        try {
          const res = await adminApi.updateUserStatus(targetUser.id, nextStatus);
          const updated = res?.data || res;
          setUsers((prev) =>
            prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus, ...updated } : u))
          );
          showAlert({
            title: `Account ${isBanned ? 'Unbanned' : 'Banned'}`,
            message: `User status changed to ${nextStatus}.`,
            type: 'success',
            autoCloseMs: 2000,
          });
        } catch (err) {
          showAlert({
            title: 'Action Failed',
            message: err?.response?.data?.message || 'Could not update user status.',
            type: 'danger',
          });
        } finally {
          setActionLoadingId(null);
        }
      },
    });
  };

  return {
    users,
    filteredUsers,
    loading,
    error,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    actionLoadingId,
    handleToggleStatus,
    refetch: fetchUsers,
  };
}
