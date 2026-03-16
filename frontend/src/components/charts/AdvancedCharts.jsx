import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ==================== LINE CHART ====================

export function LineChart({
  data,
  height = 200,
  color = '#22c55e',
  showDots = true,
  showArea = true,
  showLabels = true
}) {
  const {
    points,
    pathD,
    areaD
  } = useMemo(() => {
    if (data.length === 0) return {
      points: [],
      pathD: '',
      areaD: '',
      minValue: 0,
      maxValue: 0
    };
    const values = data.map(d => d.value);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;
    const range = max - min || 1;
    const padding = 30;
    const width = 100; // percent
    const usableHeight = height - padding * 2;
    const pts = data.map((d, i) => ({
      x: i / (data.length - 1) * (width - 10) + 5,
      y: padding + usableHeight - (d.value - min) / range * usableHeight,
      value: d.value,
      label: d.label
    }));
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = path + ` L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${height - padding} Z`;
    return {
      points: pts,
      pathD: path,
      areaD: area,
      minValue: min,
      maxValue: max
    };
  }, [data, height]);
  if (data.length === 0) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center text-foreground-muted",
      style: {
        height
      },
      children: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u"
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "relative",
    style: {
      height
    },
    children: [/*#__PURE__*/_jsxs("svg", {
      viewBox: `0 0 100 ${height}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      children: [[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => /*#__PURE__*/_jsx("line", {
        x1: "5",
        y1: 30 + (height - 60) * ratio,
        x2: "95",
        y2: 30 + (height - 60) * ratio,
        stroke: "currentColor",
        strokeOpacity: "0.1",
        strokeWidth: "0.3"
      }, i)), showArea && /*#__PURE__*/_jsx("path", {
        d: areaD,
        fill: color,
        fillOpacity: "0.1"
      }), /*#__PURE__*/_jsx("path", {
        d: pathD,
        fill: "none",
        stroke: color,
        strokeWidth: "0.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), showDots && points.map((p, i) => /*#__PURE__*/_jsxs("g", {
        children: [/*#__PURE__*/_jsx("circle", {
          cx: p.x,
          cy: p.y,
          r: "1.5",
          fill: color,
          className: "transition-all hover:r-2"
        }), /*#__PURE__*/_jsx("circle", {
          cx: p.x,
          cy: p.y,
          r: "5",
          fill: "transparent",
          className: "cursor-pointer",
          children: /*#__PURE__*/_jsxs("title", {
            children: [p.label, ": ", p.value.toLocaleString('vi-VN')]
          })
        })]
      }, i))]
    }), showLabels && /*#__PURE__*/_jsx("div", {
      className: "absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-foreground-muted",
      children: data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map((d, i) => /*#__PURE__*/_jsx("span", {
        children: d.label
      }, i))
    })]
  });
}

// ==================== PIE CHART ====================

export function PieChart({
  data,
  size = 200,
  showLegend = true,
  donut = false
}) {
  const {
    slices,
    total
  } = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    let currentAngle = -90; // Start from top

    const segments = data.map(d => {
      const percentage = d.value / sum * 100;
      const angle = d.value / sum * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      return {
        ...d,
        percentage,
        startAngle,
        endAngle
      };
    });
    return {
      slices: segments,
      total: sum
    };
  }, [data]);
  const center = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = donut ? radius * 0.6 : 0;
  function polarToCartesian(angle, r) {
    const rad = angle * Math.PI / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  }
  function describeArc(startAngle, endAngle, outerR, innerR) {
    const start1 = polarToCartesian(startAngle, outerR);
    const end1 = polarToCartesian(endAngle, outerR);
    const start2 = polarToCartesian(endAngle, innerR);
    const end2 = polarToCartesian(startAngle, innerR);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    if (innerR === 0) {
      return [`M ${center} ${center}`, `L ${start1.x} ${start1.y}`, `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}`, 'Z'].join(' ');
    }
    return [`M ${start1.x} ${start1.y}`, `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}`, `L ${start2.x} ${start2.y}`, `A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y}`, 'Z'].join(' ');
  }
  if (data.length === 0) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center text-foreground-muted",
      style: {
        width: size,
        height: size
      },
      children: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u"
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: cn('flex items-center gap-6', showLegend ? 'flex-row' : 'flex-col'),
    children: [/*#__PURE__*/_jsxs("svg", {
      width: size,
      height: size,
      className: "shrink-0",
      children: [slices.map((slice, i) => /*#__PURE__*/_jsx("path", {
        d: describeArc(slice.startAngle, slice.endAngle, radius, innerRadius),
        fill: slice.color,
        stroke: "var(--background-secondary)",
        strokeWidth: "2",
        className: "transition-all hover:opacity-80 cursor-pointer",
        children: /*#__PURE__*/_jsxs("title", {
          children: [slice.label, ": ", slice.value.toLocaleString('vi-VN'), " (", slice.percentage.toFixed(1), "%)"]
        })
      }, i)), donut && /*#__PURE__*/_jsxs("g", {
        children: [/*#__PURE__*/_jsx("text", {
          x: center,
          y: center - 5,
          textAnchor: "middle",
          className: "fill-foreground text-lg font-bold",
          style: {
            fontSize: '16px'
          },
          children: total.toLocaleString('vi-VN')
        }), /*#__PURE__*/_jsx("text", {
          x: center,
          y: center + 12,
          textAnchor: "middle",
          className: "fill-foreground-secondary",
          style: {
            fontSize: '10px'
          },
          children: "T\u1ED5ng"
        })]
      })]
    }), showLegend && /*#__PURE__*/_jsx("div", {
      className: "space-y-2",
      children: slices.map((slice, i) => /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 text-sm",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-3 h-3 rounded-sm shrink-0",
          style: {
            backgroundColor: slice.color
          }
        }), /*#__PURE__*/_jsx("span", {
          className: "text-foreground-secondary",
          children: slice.label
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-foreground font-medium ml-auto",
          children: [slice.percentage.toFixed(1), "%"]
        })]
      }, i))
    })]
  });
}

// ==================== BAR CHART (Enhanced) ====================

export function BarChart({
  data,
  height = 200,
  horizontal = false,
  showValues = true
}) {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
  if (horizontal) {
    return /*#__PURE__*/_jsx("div", {
      className: "space-y-3",
      children: data.map((item, i) => /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex justify-between text-sm mb-1",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-foreground-secondary",
            children: item.label
          }), showValues && /*#__PURE__*/_jsx("span", {
            className: "text-foreground font-medium",
            children: item.value.toLocaleString('vi-VN')
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "h-4 bg-background-tertiary rounded-full overflow-hidden",
          children: /*#__PURE__*/_jsx("div", {
            className: "h-full rounded-full transition-all duration-500",
            style: {
              width: `${item.value / maxValue * 100}%`,
              backgroundColor: item.color || 'var(--primary-500)'
            }
          })
        })]
      }, i))
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-end gap-2 justify-between",
    style: {
      height
    },
    children: data.map((item, i) => /*#__PURE__*/_jsxs("div", {
      className: "flex-1 flex flex-col items-center",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative w-full flex justify-center",
        style: {
          height: height - 30
        },
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-8 rounded-t-lg transition-all duration-500",
          style: {
            height: `${item.value / maxValue * 100}%`,
            backgroundColor: item.color || 'var(--primary-500)'
          }
        }), showValues && /*#__PURE__*/_jsx("span", {
          className: "absolute -top-5 text-xs text-foreground-secondary",
          children: item.value.toLocaleString('vi-VN')
        })]
      }), /*#__PURE__*/_jsx("span", {
        className: "text-xs text-foreground-muted mt-2 truncate max-w-full",
        children: item.label
      })]
    }, i))
  });
}