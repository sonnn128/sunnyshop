# Pages Directory Reorganization Guide

## Overview
This guide explains how to reorganize the `/pages` directory from flat structure to organized structure with `admin/`, `client/`, and `shared/` folders.

## Current Issues
- Duplicate directory nesting created during copy operations
- Old directories still exist alongside new ones
- Routes.jsx still points to old paths

## Directory Structure - FINAL GOAL

```
src/pages/
│
├── admin/                          [ALL ADMIN PAGES]
│   ├── admin-panel/
│   │   ├── activity-logs/
│   │   ├── addresses/
│   │   │   ├── AddressForm.jsx
│   │   │   └── AddressList.jsx
│   │   ├── brands/
│   │   │   ├── BrandForm.jsx
│   │   │   └── BrandList.jsx
│   │   ├── categories/
│   │   ├── chat/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   ├── AdminLayout.jsx
│   │   ├── ModernAdminLayout.jsx
│   │   └── index.jsx
│   ├── BookingCalendarPage.jsx
│   ├── CourtsPage.jsx
│   ├── CustomersPage.jsx
│   ├── CustomerDetailPage.jsx
│   ├── DashboardPage.jsx
│   ├── InventoryPage.jsx
│   ├── InvoicesPage.jsx
│   ├── PrintInvoicePage.jsx
│   ├── ReportsPage.jsx
│   ├── SettingsPage.jsx
│   └── VenuesPage.jsx
│
├── client/                         [USER/CUSTOMER PAGES]
│   ├── checkout/
│   │   └── index.jsx
│   ├── order-confirmation/
│   │   ├── index.jsx
│   │   └── OrderConfirmation.jsx
│   ├── order-detail/
│   │   └── index.jsx
│   ├── payment/
│   │   └── vnpay/
│   │       └── callback.jsx
│   ├── shopping-cart/
│   │   ├── components/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── EmptyCart.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   └── SavedForLater.jsx
│   │   └── index.jsx
│   ├── user-dashboard/
│   │   ├── components/
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── AddressBook.jsx
│   │   │   ├── LoyaltyProgram.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── ProfileSection.jsx
│   │   │   └── WishlistSection.jsx
│   │   └── index.jsx
│   └── user-orders/
│       └── index.jsx
│
└── shared/                         [SHARED/PUBLIC PAGES]
    ├── auth/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── ForgotPassword.jsx
    │   └── ResetPassword.jsx
    ├── errors/
    │   ├── Forbidden.jsx
    │   └── NotFound.jsx
    ├── homepage/
    │   ├── components/
    │   │   ├── FeaturedCategories.jsx
    │   │   ├── Footer.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── ProductCarousel.jsx
    │   │   ├── PromotionalBanners.jsx
    │   │   └── SocialProof.jsx
    │   └── index.jsx
    ├── product-catalog/
    │   ├── components/
    │   │   ├── CategoryNavigation.jsx
    │   │   ├── FilterSidebar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── QuickViewModal.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── SortDropdown.jsx
    │   └── index.jsx
    ├── product-detail/
    │   ├── components/
    │   │   ├── ProductImageGallery.jsx
    │   │   ├── ProductInfo.jsx
    │   │   ├── ProductTabs.jsx
    │   │   ├── RecentlyViewed.jsx
    │   │   ├── RelatedProducts.jsx
    │   │   └── StylingTips.jsx
    │   └── index.jsx
    ├── DebugAuth.jsx
    ├── LoginPage.jsx
    └── ForgotPasswordPage.jsx
```

## Migration Steps

### Phase 1: Flatten Nested Directories

Run these commands in Windows PowerShell or Git Bash:

```bash
cd src/pages

# Fix client folder nesting
mkdir temp_client
xcopy client\checkout\checkout\* temp_client\checkout\ /E /I
xcopy client\order-confirmation\order-confirmation\* temp_client\order-confirmation\ /E /I
xcopy client\order-detail\order-detail\* temp_client\order-detail\ /E /I
xcopy client\payment\payment\* temp_client\payment\ /E /I
xcopy client\shopping-cart\shopping-cart\* temp_client\shopping-cart\ /E /I
xcopy client\user-dashboard\user-dashboard\* temp_client\user-dashboard\ /E /I
xcopy client\user-orders\user-orders\* temp_client\user-orders\ /E /I

# Remove old and replace
rmdir /S /Q client
ren temp_client client

# Fix shared folder nesting similarly
mkdir temp_shared
xcopy shared\auth\* temp_shared\auth\ /E /I
xcopy shared\errors\* temp_shared\errors\ /E /I
xcopy shared\homepage\homepage\* temp_shared\homepage\ /E /I
xcopy shared\product-catalog\product-catalog\* temp_shared\product-catalog\ /E /I
xcopy shared\product-detail\product-detail\* temp_shared\product-detail\ /E /I

rmdir /S /Q shared
ren temp_shared shared
```

### Phase 2: Move Root-Level Admin Pages

```bash
# Move admin pages to admin folder
move admin-panel admin\admin-panel
move BookingCalendarPage.jsx admin\
move CourtsPage.jsx admin\
move CustomersPage.jsx admin\
move CustomerDetailPage.jsx admin\
move DashboardPage.jsx admin\
move InventoryPage.jsx admin\
move InvoicesPage.jsx admin\
move PrintInvoicePage.jsx admin\
move ReportsPage.jsx admin\
move SettingsPage.jsx admin\
move VenuesPage.jsx admin\
```

### Phase 3: Move Root-Level Shared Pages

```bash
# Move shared pages
move LoginPage.jsx shared\
move ForgotPasswordPage.jsx shared\
move Forbidden.jsx shared\errors\
move NotFound.jsx shared\errors\
move DebugAuth.jsx shared\
```

### Phase 4: Update Routes.jsx Import Paths

Update all imports in `src/Routes.jsx`:

**Before:**
```javascript
import NotFound from "pages/NotFound";
import Login from "pages/auth/Login";
import AdminPanel from "./pages/admin-panel";
import ProductForm from "./pages/admin-panel/products/ProductForm";
```

**After:**
```javascript
import NotFound from "pages/shared/errors/NotFound";
import Login from "pages/shared/auth/Login";
import AdminPanel from "./pages/admin/admin-panel";
import ProductForm from "./pages/admin/admin-panel/products/ProductForm";
```

### Phase 5: Update Other File Imports

Search for and update imports in these files:
- `src/index.jsx`
- `src/main.jsx`
- Any components that import from `/pages`
- Layout files that reference page components
- Any utility files with page imports

Use Find and Replace in VS Code:
- Find: `from "pages/admin-panel`
- Replace: `from "pages/admin/admin-panel`
- Do this for all path patterns

### Phase 6: Verify and Clean

1. Run `npm run dev` to start the dev server
2. Test all routes to ensure they still work
3. Check browser console for any import errors
4. Verify no 404 errors for components

### Phase 7: Delete Old Directories (After Verification)

Only after confirming everything works:

```bash
# Remove old directories if they still exist
rmdir /S /Q admin-panel
rmdir /S /Q checkout
rmdir /S /Q auth
rmdir /S /Q homepage
rmdir /S /Q product-catalog
rmdir /S /Q product-detail
rmdir /S /Q order-confirmation
rmdir /S /Q order-detail
rmdir /S /Q payment
rmdir /S /Q shopping-cart
rmdir /S /Q user-dashboard
rmdir /S /Q user-orders
```

## Path Mapping Reference

| Old Path | New Path |
|----------|----------|
| `pages/admin-panel/*` | `pages/admin/admin-panel/*` |
| `pages/auth/*` | `pages/shared/auth/*` |
| `pages/homepage/*` | `pages/shared/homepage/*` |
| `pages/product-catalog/*` | `pages/shared/product-catalog/*` |
| `pages/product-detail/*` | `pages/shared/product-detail/*` |
| `pages/checkout/*` | `pages/client/checkout/*` |
| `pages/order-confirmation/*` | `pages/client/order-confirmation/*` |
| `pages/order-detail/*` | `pages/client/order-detail/*` |
| `pages/payment/*` | `pages/client/payment/*` |
| `pages/shopping-cart/*` | `pages/client/shopping-cart/*` |
| `pages/user-dashboard/*` | `pages/client/user-dashboard/*` |
| `pages/user-orders/*` | `pages/client/user-orders/*` |
| `pages/NotFound` | `pages/shared/errors/NotFound` |
| `pages/Forbidden` | `pages/shared/errors/Forbidden` |
| `pages/DebugAuth` | `pages/shared/DebugAuth` |

## Benefits of This Organization

✅ **Clear Separation of Concerns** - Admin, Client, and Shared pages are logically organized
✅ **Easier Maintenance** - Find admin pages in one place, client pages in another
✅ **Scalability** - Easy to add new pages to appropriate folders
✅ **Team Collaboration** - Developers know where to look for specific features
✅ **Access Control** - Can apply different rules/permissions based on folder
✅ **Code Splitting** - Easier to implement lazy loading per folder
✅ **Reduced Cognitive Load** - Smaller, more focused directory structures

## Troubleshooting

### If Components Not Rendering After Update

1. Check Routes.jsx for correct import paths
2. Use browser DevTools → Console for import errors
3. Search for any remaining old import paths with Find in Files
4. Verify component file names match import statements

### If Build Fails

1. Check for circular imports
2. Verify all imports are using the new paths
3. Run `npm run lint` to find syntax errors
4. Delete `node_modules` and `package-lock.json`, then `npm install`

### If Routes Don't Work

1. Verify Routes.jsx has all updated paths
2. Check that dynamic `import()` statements are updated
3. Test individual routes in browser URL bar
4. Check Network tab in DevTools for 404 errors

## Notes

- This reorganization is backward-compatible if done correctly
- No database or API changes needed
- All functionality remains the same, just organized differently
- Can be done incrementally if preferred

## Questions?

If you encounter issues during reorganization, check the console for specific error messages indicating which imports need updating.
