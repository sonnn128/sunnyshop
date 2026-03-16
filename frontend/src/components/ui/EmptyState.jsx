import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: cn('flex flex-col items-center justify-center py-16 px-4', className),
    children: [/*#__PURE__*/_jsxs("div", {
      className: "relative mb-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 flex items-center justify-center",
        children: /*#__PURE__*/_jsx("div", {
          className: "w-32 h-32 rounded-full bg-primary-500/5 animate-pulse"
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 flex items-center justify-center",
        children: /*#__PURE__*/_jsx("div", {
          className: "w-24 h-24 rounded-full bg-primary-500/10"
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "relative w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center",
        children: /*#__PURE__*/_jsx(Icon, {
          className: "w-8 h-8 text-primary-500"
        })
      })]
    }), /*#__PURE__*/_jsx("h3", {
      className: "text-lg font-semibold text-foreground mb-2",
      children: title
    }), description && /*#__PURE__*/_jsx("p", {
      className: "text-sm text-foreground-secondary text-center max-w-sm mb-6",
      children: description
    }), actionLabel && onAction && /*#__PURE__*/_jsx(Button, {
      onClick: onAction,
      children: actionLabel
    })]
  });
}