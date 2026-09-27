/**
 * Role Normalization Utility
 * Maps any role variations or legacy aliases (operator, vendor, user, shopper)
 * to standard 3 RBAC roles: admin, farmer, customer.
 */
export const normalizeRole = (rawRole) => {
  if (!rawRole) return 'customer';
  const roleLower = String(rawRole).trim().toLowerCase();
  if (roleLower === 'operator' || roleLower === 'vendor') return 'farmer';
  if (roleLower === 'user' || roleLower === 'shopper') return 'customer';
  return roleLower;
};

export default normalizeRole;
