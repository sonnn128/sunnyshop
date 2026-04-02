package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.*;
import com.sonnguyen.laptopshop.payload.request.CartItemRequest;
import com.sonnguyen.laptopshop.payload.response.CartResponse;
import com.sonnguyen.laptopshop.repository.*;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartDetailRepository cartDetailRepository, 
                      ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartDetailRepository = cartDetailRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartResponse getCartByUserId(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return null;
        }
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        if (cartOpt.isPresent()) {
            return ModelMapper.toCartResponse(cartOpt.get());
        }
        return null;
    }

    public CartResponse addItemToCart(String username, CartItemRequest request) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient product quantity");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setSum(0);
                    return cartRepository.save(newCart);
                });

        Optional<CartDetail> existingItem = cartDetailRepository.findByCartAndProduct(cart, product);
        if (existingItem.isPresent()) {
            CartDetail cartDetail = existingItem.get();
            cartDetail.setQuantity(cartDetail.getQuantity() + request.getQuantity());
            cartDetail.setPrice(product.getPrice());
            cartDetailRepository.save(cartDetail);
        } else {
            CartDetail cartDetail = new CartDetail();
            cartDetail.setCart(cart);
            cartDetail.setProduct(product);
            cartDetail.setQuantity(request.getQuantity());
            cartDetail.setPrice(product.getPrice());
            cartDetailRepository.save(cartDetail);
        }

        updateCartSum(cart);
        return ModelMapper.toCartResponse(cart);
    }

    public CartResponse updateCartItem(String username, Long cartDetailId, Long quantity) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartDetail.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cartDetailRepository.delete(cartDetail);
        } else {
            if (cartDetail.getProduct().getQuantity() < quantity) {
                throw new RuntimeException("Insufficient product quantity");
            }
            cartDetail.setQuantity(quantity);
            cartDetailRepository.save(cartDetail);
        }

        updateCartSum(cart);
        return ModelMapper.toCartResponse(cart);
    }

    public CartResponse removeItemFromCart(String username, Long cartDetailId) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartDetail.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        cartDetailRepository.delete(cartDetail);
        updateCartSum(cart);
        return ModelMapper.toCartResponse(cart);
    }

    public void clearCart(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartDetailRepository.deleteByCart(cart);
        cart.setSum(0);
        cartRepository.save(cart);
    }

    private void updateCartSum(Cart cart) {
        List<CartDetail> cartDetails = cartDetailRepository.findByCart(cart);
        int sum = cartDetails.stream()
                .mapToInt(detail -> (int) (detail.getQuantity() * detail.getPrice()))
                .sum();
        cart.setSum(sum);
        cartRepository.save(cart);
    }
}
