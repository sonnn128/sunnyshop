import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '@/services/invoice.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function PrintInvoicePage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);
  const {
    data: invoice,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceApi.getById(id),
    enabled: !!id
  });
  useEffect(() => {
    if (invoice && !isPrinting) {
      setIsPrinting(true);
      // Delay print to ensure rendering is complete
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [invoice, isPrinting]);
  if (isLoading) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center h-screen",
      children: /*#__PURE__*/_jsx("div", {
        className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
      })
    });
  }
  if (error || !invoice) {
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center h-screen gap-4",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-red-500",
        children: "Kh\xF4ng t\xECm th\u1EA5y h\xF3a \u0111\u01A1n"
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => navigate('/invoices'),
        className: "text-primary-500 hover:underline",
        children: "Quay l\u1EA1i"
      })]
    });
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("style", {
      children: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-invoice, #print-invoice * {
                        visibility: visible;
                    }
                    #print-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `
    }), /*#__PURE__*/_jsx("div", {
      className: "no-print fixed top-4 left-4 z-50",
      children: /*#__PURE__*/_jsx("button", {
        onClick: () => navigate('/invoices'),
        className: "flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700",
        children: "\u2190 Quay l\u1EA1i"
      })
    }), /*#__PURE__*/_jsxs("div", {
      id: "print-invoice",
      className: "max-w-3xl mx-auto p-8 bg-white text-black",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between border-b-2 border-gray-200 pb-6 mb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-3xl font-bold text-primary-600",
            children: "COURTIFY"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-gray-600 mt-1",
            children: "H\u1EC7 th\u1ED1ng qu\u1EA3n l\xFD s\xE2n c\u1EA7u l\xF4ng"
          }), /*#__PURE__*/_jsxs("div", {
            className: "mt-2 text-sm text-gray-500",
            children: [/*#__PURE__*/_jsx("p", {
              children: "123 Phan X\xEDch Long, Ph\xFA Nhu\u1EADn, TP.HCM"
            }), /*#__PURE__*/_jsx("p", {
              children: "Hotline: 028 1234 5678"
            }), /*#__PURE__*/_jsx("p", {
              children: "Email: info@courtify.vn"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-right",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-bold text-gray-800",
            children: "H\xD3A \u0110\u01A0N"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-lg font-mono text-gray-600",
            children: invoice.invoiceNumber
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-gray-500 mt-2",
            children: ["Ng\xE0y: ", formatDate(new Date(invoice.createdAt))]
          }), invoice.paidAt && /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-green-600",
            children: ["Thanh to\xE1n: ", formatDate(new Date(invoice.paidAt))]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-gray-50 rounded-lg p-4 mb-6",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "font-semibold text-gray-800 mb-2",
          children: "Th\xF4ng tin kh\xE1ch h\xE0ng"
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4 text-sm",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-gray-500",
              children: "H\u1ECD t\xEAn:"
            }), /*#__PURE__*/_jsx("span", {
              className: "ml-2 font-medium",
              children: invoice.customer?.name || 'Khách lẻ'
            })]
          }), invoice.customer?.phone && /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-gray-500",
              children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:"
            }), /*#__PURE__*/_jsx("span", {
              className: "ml-2 font-medium",
              children: invoice.customer.phone
            })]
          }), invoice.customer?.membershipTier && /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-gray-500",
              children: "H\u1ED9i vi\xEAn:"
            }), /*#__PURE__*/_jsx("span", {
              className: "ml-2 font-medium",
              children: invoice.customer.membershipTier
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("table", {
        className: "w-full mb-6",
        children: [/*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            className: "border-b-2 border-gray-200",
            children: [/*#__PURE__*/_jsx("th", {
              className: "text-left py-3 font-semibold text-gray-700",
              children: "M\xF4 t\u1EA3"
            }), /*#__PURE__*/_jsx("th", {
              className: "text-center py-3 font-semibold text-gray-700 w-20",
              children: "SL"
            }), /*#__PURE__*/_jsx("th", {
              className: "text-right py-3 font-semibold text-gray-700 w-32",
              children: "\u0110\u01A1n gi\xE1"
            }), /*#__PURE__*/_jsx("th", {
              className: "text-right py-3 font-semibold text-gray-700 w-32",
              children: "Th\xE0nh ti\u1EC1n"
            })]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          children: invoice.items.map((item, index) => /*#__PURE__*/_jsxs("tr", {
            className: index % 2 === 0 ? 'bg-gray-50' : '',
            children: [/*#__PURE__*/_jsx("td", {
              className: "py-3 px-2",
              children: item.description
            }), /*#__PURE__*/_jsx("td", {
              className: "py-3 px-2 text-center",
              children: item.quantity
            }), /*#__PURE__*/_jsx("td", {
              className: "py-3 px-2 text-right",
              children: formatCurrency(item.unitPrice)
            }), /*#__PURE__*/_jsx("td", {
              className: "py-3 px-2 text-right font-medium",
              children: formatCurrency(item.total)
            })]
          }, item.id))
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "border-t-2 border-gray-200 pt-4",
        children: /*#__PURE__*/_jsx("div", {
          className: "flex justify-end",
          children: /*#__PURE__*/_jsxs("div", {
            className: "w-80",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between py-2 text-sm",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-gray-600",
                children: "T\u1EA1m t\xEDnh:"
              }), /*#__PURE__*/_jsx("span", {
                children: formatCurrency(invoice.subtotal)
              })]
            }), invoice.discount > 0 && /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between py-2 text-sm",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-gray-600",
                children: "Gi\u1EA3m gi\xE1:"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-red-600",
                children: ["-", formatCurrency(invoice.discount)]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between py-3 text-lg font-bold border-t border-gray-200 mt-2",
              children: [/*#__PURE__*/_jsx("span", {
                children: "T\u1ED5ng c\u1ED9ng:"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-primary-600",
                children: formatCurrency(invoice.total)
              })]
            }), invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex justify-between py-2 text-sm",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-gray-600",
                  children: "\u0110\xE3 thanh to\xE1n:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-green-600",
                  children: formatCurrency(invoice.paidAmount)
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between py-2 text-sm font-medium",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-gray-600",
                  children: "C\xF2n l\u1EA1i:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-red-600",
                  children: formatCurrency(invoice.total - invoice.paidAmount)
                })]
              })]
            })]
          })
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-6 p-4 rounded-lg border-2 text-center",
        style: {
          borderColor: invoice.paymentStatus === 'PAID' ? '#22c55e' : invoice.paymentStatus === 'PARTIAL' ? '#f59e0b' : '#ef4444',
          backgroundColor: invoice.paymentStatus === 'PAID' ? '#f0fdf4' : invoice.paymentStatus === 'PARTIAL' ? '#fffbeb' : '#fef2f2'
        },
        children: /*#__PURE__*/_jsxs("span", {
          className: "text-lg font-bold",
          style: {
            color: invoice.paymentStatus === 'PAID' ? '#16a34a' : invoice.paymentStatus === 'PARTIAL' ? '#d97706' : '#dc2626'
          },
          children: [invoice.paymentStatus === 'PAID' && '✓ ĐÃ THANH TOÁN', invoice.paymentStatus === 'PARTIAL' && '⏳ THANH TOÁN MỘT PHẦN', invoice.paymentStatus === 'PENDING' && '⏳ CHƯA THANH TOÁN', invoice.paymentStatus === 'REFUNDED' && '↩ ĐÃ HOÀN TIỀN']
        })
      }), invoice.notes && /*#__PURE__*/_jsxs("div", {
        className: "mt-6 p-4 bg-gray-50 rounded-lg",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "font-semibold text-gray-800 mb-2",
          children: "Ghi ch\xFA"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-gray-600",
          children: invoice.notes
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500",
        children: [/*#__PURE__*/_jsx("p", {
          children: "C\u1EA3m \u01A1n qu\xFD kh\xE1ch \u0111\xE3 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a Courtify!"
        }), /*#__PURE__*/_jsx("p", {
          className: "mt-1",
          children: "M\u1ECDi th\u1EAFc m\u1EAFc xin li\xEAn h\u1EC7: 028 1234 5678 | info@courtify.vn"
        })]
      })]
    })]
  });
}