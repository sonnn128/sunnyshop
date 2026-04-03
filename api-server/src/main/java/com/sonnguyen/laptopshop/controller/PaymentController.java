package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.config.VNPayConfig;
import com.sonnguyen.laptopshop.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final com.sonnguyen.laptopshop.service.CartService cartService;
    private final com.sonnguyen.laptopshop.repository.OrderRepository orderRepository;

    @GetMapping("/vnpay/create-payment")
    public ResponseEntity<?> createPayment(HttpServletRequest request,
                                           @RequestParam("amount") long amount,
                                           @RequestParam("orderInfo") String orderInfo,
                                           @RequestParam("orderId") String orderId) throws Exception {

        long amountVND = amount * 100;
        String vnp_TxnRef = orderId + "_" + System.currentTimeMillis();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountVND));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB"); // Default bank for Sandbox testing
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

        return ResponseEntity.ok(Map.of("status", "ok", "message", "success", "url", paymentUrl));
    }

    @GetMapping("/vnpay/return")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        
        if ("00".equals(vnp_ResponseCode)) {
            try {
                String orderIdStr = vnp_TxnRef.split("_")[0];
                Long orderId = Long.parseLong(orderIdStr);
                orderService.updateOrderStatus(orderId, "PAID");
                
                // Clear cart for the user
                com.sonnguyen.laptopshop.model.Order order = orderRepository.findById(orderId).orElse(null);
                if (order != null && order.getUser() != null) {
                    cartService.clearCart(order.getUser().getUsername());
                }
                
                response.sendRedirect("http://localhost:5173/orders?payment=success&orderId=" + orderIdStr);
            } catch (Exception e) {
                response.sendRedirect("http://localhost:5173/orders?payment=failed&reason=update_failed");
            }
        } else {
            try {
                if (vnp_TxnRef != null) {
                    String orderIdStr = vnp_TxnRef.split("_")[0];
                    orderService.cancelOrder(Long.parseLong(orderIdStr));
                }
            } catch (Exception e) {
               // ignore
            }
            response.sendRedirect("http://localhost:5173/cart?payment=failed");
        }
    }
}
