import { useMemo } from 'react';

/**
 * Custom hook to check user role and permissions
 * @returns {Object} Role information and permission checkers
 */
export const useRole = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const role = user?.role || 'staff';

  // Permission level constants
  const ROLES = {
    STAFF: 'staff',
    MANAGER: 'manager',
    ADMIN: 'admin'
  };

  // Role hierarchy: staff < manager < admin
  const ROLE_HIERARCHY = {
    staff: 1,
    manager: 2,
    admin: 3
  };

  /**
   * Check if user has specific role
   * @param {string} requiredRole - Role to check
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  /**
   * Check if user has at least the specified role level
   * (e.g., hasMinRole('manager') returns true for manager and admin)
   * @param {string} minRole - Minimum required role
   * @returns {boolean}
   */
  const hasMinRole = (minRole) => {
    const userLevel = ROLE_HIERARCHY[role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
    return userLevel >= requiredLevel;
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of allowed roles
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  // Specific role checkers
  const isStaff = role === ROLES.STAFF;
  const isManager = role === ROLES.MANAGER;
  const isAdmin = role === ROLES.ADMIN;

  // Permission groups based on requirements
  const permissions = {
    // Product Management
    canViewProducts: true, // All roles
    canCreateProduct: true, // All roles (staff needs approval)
    canEditProduct: true, // All roles (staff needs approval)
    canDeleteProduct: hasMinRole(ROLES.MANAGER), // Manager and Admin only
    canApproveProductChanges: hasMinRole(ROLES.MANAGER), // Manager and Admin only

    // Order Management
    canViewOrders: true, // All roles
    canProcessOrders: true, // All roles
    canCancelOrders: hasMinRole(ROLES.MANAGER), // Manager and Admin only

    // Promotions & Collections
    canViewPromotions: true, // All roles
    canManagePromotions: hasMinRole(ROLES.MANAGER), // Manager and Admin only
    canManageCollections: hasMinRole(ROLES.MANAGER), // Manager and Admin only

    // Reports & Analytics
    canViewBasicReports: true, // All roles
    canViewSalesReports: hasMinRole(ROLES.MANAGER), // Manager and Admin only
    canViewAnalytics: hasMinRole(ROLES.MANAGER), // Manager and Admin only
    canViewCustomerBehavior: hasMinRole(ROLES.MANAGER), // Manager and Admin only

    // Customer Support
    canRespondToCustomers: true, // All roles
    canAccessCustomerData: hasMinRole(ROLES.MANAGER), // Manager and Admin only

    // User Management
    canViewUsers: hasMinRole(ROLES.ADMIN), // Admin only
    canCreateUsers: hasMinRole(ROLES.ADMIN), // Admin only
    canEditUsers: hasMinRole(ROLES.ADMIN), // Admin only
    canManagePermissions: hasMinRole(ROLES.ADMIN), // Admin only

    // System Configuration
    canAccessSystemSettings: hasMinRole(ROLES.ADMIN), // Admin only
    canConfigurePayments: hasMinRole(ROLES.ADMIN), // Admin only
    canManageBackups: hasMinRole(ROLES.ADMIN), // Admin only
    canAccessSecuritySettings: hasMinRole(ROLES.ADMIN), // Admin only
    canMonitorSystem: hasMinRole(ROLES.ADMIN), // Admin only
  };

  return {
    user,
    role,
    ROLES,
    hasRole,
    hasMinRole,
    hasAnyRole,
    isStaff,
    isManager,
    isAdmin,
    permissions
  };
};

export default useRole;
