package com.sonnguyen.trendwearshop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sonnguyen.trendwearshop.model.Brand;
import com.sonnguyen.trendwearshop.model.Category;
import com.sonnguyen.trendwearshop.model.Coupon;
import com.sonnguyen.trendwearshop.model.Target;
import com.sonnguyen.trendwearshop.payload.request.ChatMessage;
import com.sonnguyen.trendwearshop.payload.request.ChatRequest;
import com.sonnguyen.trendwearshop.payload.response.ProductResponse;
import com.sonnguyen.trendwearshop.repository.BrandRepository;
import com.sonnguyen.trendwearshop.repository.CategoryRepository;
import com.sonnguyen.trendwearshop.repository.CouponRepository;
import com.sonnguyen.trendwearshop.repository.TargetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final TargetRepository targetRepository;
    private final CouponRepository couponRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public ChatbotService(ProductService productService,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          TargetRepository targetRepository,
                          CouponRepository couponRepository,
                          ObjectMapper objectMapper) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.targetRepository = targetRepository;
        this.couponRepository = couponRepository;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public String getChatbotResponse(ChatRequest chatRequest) {
        try {
            // Chuẩn bị lịch sử hội thoại dưới dạng ArrayNode của Jackson
            ArrayNode historyNode = objectMapper.createArrayNode();
            for (ChatMessage message : chatRequest.getMessages()) {
                ObjectNode messageNode = objectMapper.createObjectNode();
                messageNode.put("role", message.getRole());
                ArrayNode partsNode = objectMapper.createArrayNode();
                partsNode.add(objectMapper.createObjectNode().put("text", message.getContent()));
                messageNode.set("parts", partsNode);
                historyNode.add(messageNode);
            }

            return executeChatLoop(historyNode, 0);
        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn: " + e.getMessage();
        }
    }

    private String executeChatLoop(ArrayNode historyNode, int depth) throws Exception {
        // Giới hạn số lần gọi đệ quy tránh lặp vô tận (tối đa 3 lần gọi Tool liên tiếp)
        if (depth >= 3) {
            return "Xin lỗi, mình gặp chút khó khăn trong việc tìm kiếm dữ liệu. Bạn có thể hỏi lại rõ hơn được không?";
        }

        // Tạo Request Body gửi tới Gemini
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.set("contents", historyNode);

        // Prompt hệ thống (System Instruction)
        ObjectNode systemInstruction = objectMapper.createObjectNode();
        ArrayNode sysParts = objectMapper.createArrayNode();
        sysParts.add(objectMapper.createObjectNode().put("text", 
            "Bạn là Stylist ảo và trợ lý tư vấn thời trang thông minh của cửa hàng thời trang TrendWearShop. " +
            "Hãy trả lời khách hàng thân thiện, nhiệt tình bằng tiếng Việt. " +
            "Sử dụng các Tool/Function được cung cấp khi khách hàng hỏi về size quần áo, tìm kiếm sản phẩm hoặc hỏi về khuyến mãi. " +
            "Khi hiển thị sản phẩm, hãy định dạng chúng dưới dạng cấu trúc Markdown đặc biệt như sau để Frontend có thể hiển thị dạng Card đẹp mắt: " +
            "[PRODUCT_CARD:id={id}|name={name}|price={price}|image={image}]. Ví dụ: [PRODUCT_CARD:id=1|name=Áo Thun Polo|price=250000.0|image=http://res.cloudinary.com/...]. " +
            "Mỗi sản phẩm hiển thị trên một dòng riêng. Không hiển thị sản phẩm dạng list gạch đầu dòng thông thường nếu có đầy đủ thông tin để làm PRODUCT_CARD."
        ));
        systemInstruction.set("parts", sysParts);
        requestBody.set("systemInstruction", systemInstruction);

        // Định nghĩa các Tool (Functions)
        ObjectNode toolsWrapper = objectMapper.createObjectNode();
        ArrayNode functionDeclarations = objectMapper.createArrayNode();

        // 1. Tool searchProducts
        ObjectNode searchFunc = objectMapper.createObjectNode();
        searchFunc.put("name", "searchProducts");
        searchFunc.put("description", "Tìm kiếm sản phẩm quần áo thời trang theo từ khóa, tên danh mục, tên thương hiệu, nhóm đối tượng giới tính (Nam, Nữ, Trẻ Em, Unisex) và khoảng giá.");
        ObjectNode searchParams = objectMapper.createObjectNode();
        searchParams.put("type", "OBJECT");
        ObjectNode searchProps = objectMapper.createObjectNode();
        searchProps.set("keyword", objectMapper.createObjectNode().put("type", "STRING").put("description", "Từ khóa tìm kiếm (ví dụ: áo sơ mi, quần tây)"));
        searchProps.set("categoryName", objectMapper.createObjectNode().put("type", "STRING").put("description", "Tên danh mục sản phẩm (ví dụ: Áo Sơ Mi, Quần Tây, Váy)"));
        searchProps.set("brandName", objectMapper.createObjectNode().put("type", "STRING").put("description", "Tên thương hiệu (ví dụ: Nike, Adidas, Gucci)"));
        searchProps.set("genderName", objectMapper.createObjectNode().put("type", "STRING").put("description", "Nhóm đối tượng khách hàng (ví dụ: Nam, Nữ, Trẻ Em, Unisex)"));
        searchProps.set("minPrice", objectMapper.createObjectNode().put("type", "NUMBER").put("description", "Giá tối thiểu"));
        searchProps.set("maxPrice", objectMapper.createObjectNode().put("type", "NUMBER").put("description", "Giá tối đa"));
        searchParams.set("properties", searchProps);
        searchFunc.set("parameters", searchParams);
        functionDeclarations.add(searchFunc);

        // 2. Tool recommendSize
        ObjectNode sizeFunc = objectMapper.createObjectNode();
        sizeFunc.put("name", "recommendSize");
        sizeFunc.put("description", "Gợi ý size quần áo (S, M, L, XL, XXL) dựa trên chiều cao (cm), cân nặng (kg) và giới tính.");
        ObjectNode sizeParams = objectMapper.createObjectNode();
        sizeParams.put("type", "OBJECT");
        ObjectNode sizeProps = objectMapper.createObjectNode();
        sizeProps.set("height", objectMapper.createObjectNode().put("type", "NUMBER").put("description", "Chiều cao của khách hàng tính bằng cm"));
        sizeProps.set("weight", objectMapper.createObjectNode().put("type", "NUMBER").put("description", "Cân nặng của khách hàng tính bằng kg"));
        sizeProps.set("gender", objectMapper.createObjectNode().put("type", "STRING").put("description", "Giới tính (Nam, Nữ)"));
        sizeProps.set("fitPreference", objectMapper.createObjectNode().put("type", "STRING").put("description", "Sở thích mặc đồ (fit: vừa vặn, loose: rộng rãi/oversize, tight: ôm sát)"));
        sizeParams.set("properties", sizeProps);
        ArrayNode sizeRequired = objectMapper.createArrayNode();
        sizeRequired.add("height").add("weight");
        sizeParams.set("required", sizeRequired);
        sizeFunc.set("parameters", sizeParams);
        functionDeclarations.add(sizeFunc);

        // 3. Tool getActiveCoupons
        ObjectNode couponFunc = objectMapper.createObjectNode();
        couponFunc.put("name", "getActiveCoupons");
        couponFunc.put("description", "Lấy danh sách mã giảm giá, khuyến mãi đang hoạt động tại cửa hàng.");
        ObjectNode couponParams = objectMapper.createObjectNode();
        couponParams.put("type", "OBJECT");
        couponParams.set("properties", objectMapper.createObjectNode());
        couponFunc.set("parameters", couponParams);
        functionDeclarations.add(couponFunc);

        toolsWrapper.set("functionDeclarations", functionDeclarations);
        ArrayNode toolsList = objectMapper.createArrayNode();
        toolsList.add(toolsWrapper);
        requestBody.set("tools", toolsList);

        // Gửi request tới Gemini API
        String url = apiUrl + "?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);
        JsonNode responseNode = objectMapper.readTree(responseEntity.getBody());

        // Lấy kết quả từ Gemini
        JsonNode candidate = responseNode.path("candidates").path(0);
        JsonNode content = candidate.path("content");
        JsonNode parts = content.path("parts");

        if (parts.isArray() && parts.size() > 0) {
            JsonNode part = parts.get(0);
            
            // Trường hợp Gemini yêu cầu gọi Function (Tool Calling)
            if (part.has("functionCall")) {
                JsonNode functionCall = part.get("functionCall");
                String functionName = functionCall.path("name").asText();
                JsonNode args = functionCall.path("args");

                // Thực thi hàm tương ứng ở Backend
                JsonNode resultNode = executeFunction(functionName, args);

                // Thêm phản hồi functionCall của Gemini vào lịch sử chat
                ObjectNode modelMessage = objectMapper.createObjectNode();
                modelMessage.put("role", "model");
                ArrayNode modelParts = objectMapper.createArrayNode();
                modelParts.add(part.deepCopy());
                modelMessage.set("parts", modelParts);
                historyNode.add(modelMessage);

                // Thêm kết quả trả về từ Backend (role: function) vào lịch sử chat
                ObjectNode functionMessage = objectMapper.createObjectNode();
                functionMessage.put("role", "function");
                ArrayNode functionParts = objectMapper.createArrayNode();
                ObjectNode responseWrapper = objectMapper.createObjectNode();
                ObjectNode functionResponse = objectMapper.createObjectNode();
                functionResponse.put("name", functionName);
                
                functionResponse.set("response", resultNode);
                
                responseWrapper.set("functionResponse", functionResponse);
                functionParts.add(responseWrapper);
                functionMessage.set("parts", functionParts);
                historyNode.add(functionMessage);

                // Tiếp tục vòng lặp gọi lại Gemini với thông tin lịch sử mới nhận được
                return executeChatLoop(historyNode, depth + 1);
            }

            // Trường hợp Gemini trả về Text thông thường
            if (part.has("text")) {
                return part.get("text").asText();
            }
        }

        return "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn có thể mô tả chi tiết hơn được không?";
    }

    private JsonNode executeFunction(String functionName, JsonNode args) {
        ObjectNode result = objectMapper.createObjectNode();

        try {
            if ("searchProducts".equals(functionName)) {
                String keyword = args.has("keyword") ? args.get("keyword").asText() : "";
                String categoryName = args.has("categoryName") ? args.get("categoryName").asText() : null;
                String brandName = args.has("brandName") ? args.get("brandName").asText() : null;
                String genderName = args.has("genderName") ? args.get("genderName").asText() : null;
                Double minPrice = args.has("minPrice") ? args.get("minPrice").asDouble() : null;
                Double maxPrice = args.has("maxPrice") ? args.get("maxPrice").asDouble() : null;

                List<Long> categoryIds = new ArrayList<>();
                if (categoryName != null) {
                    Optional<Category> catOpt = categoryRepository.findByName(categoryName);
                    if (!catOpt.isPresent()) {
                        catOpt = categoryRepository.findBySlug(categoryName.toLowerCase().replace(" ", "-"));
                    }
                    catOpt.ifPresent(category -> categoryIds.add(category.getId()));
                }

                List<String> factories = new ArrayList<>();
                if (brandName != null) {
                    Optional<Brand> brandOpt = brandRepository.findAll().stream()
                            .filter(b -> b.getName().equalsIgnoreCase(brandName) || b.getSlug().equalsIgnoreCase(brandName))
                            .findFirst();
                    if (brandOpt.isPresent()) {
                        factories.add(brandOpt.get().getSlug());
                    } else {
                        factories.add(brandName.toLowerCase().replace(" ", "-"));
                    }
                }

                List<String> targets = new ArrayList<>();
                if (genderName != null) {
                    String cleanGender = genderName.toLowerCase();
                    Optional<Target> targetOpt = targetRepository.findAll().stream()
                            .filter(t -> t.getName().toLowerCase().contains(cleanGender) || t.getSlug().toLowerCase().contains(cleanGender))
                            .findFirst();
                    if (targetOpt.isPresent()) {
                        targets.add(targetOpt.get().getSlug());
                    } else {
                        // fallback mapping
                        if (cleanGender.contains("nam")) {
                            targets.add("nam");
                        } else if (cleanGender.contains("nữ") || cleanGender.contains("nu")) {
                            targets.add("nu");
                        } else if (cleanGender.contains("trẻ") || cleanGender.contains("tre")) {
                            targets.add("tre-em");
                        } else if (cleanGender.contains("unisex")) {
                            targets.add("unisex");
                        }
                    }
                }

                Pageable pageable = PageRequest.of(0, 5);
                Page<ProductResponse> productPage = productService.getProductsWithFilters(
                        factories.isEmpty() ? null : factories,
                        targets.isEmpty() ? null : targets,
                        categoryIds.isEmpty() ? null : categoryIds,
                        minPrice,
                        maxPrice,
                        keyword.isEmpty() ? null : keyword,
                        pageable
                );

                ArrayNode productsArray = objectMapper.createArrayNode();
                for (ProductResponse p : productPage.getContent()) {
                    ObjectNode pNode = objectMapper.createObjectNode();
                    pNode.put("id", p.getId());
                    pNode.put("name", p.getName());
                    pNode.put("price", p.getPrice());
                    pNode.put("image", p.getImage());
                    productsArray.add(pNode);
                }
                result.set("products", productsArray);
                result.put("totalResults", productPage.getTotalElements());

            } else if ("recommendSize".equals(functionName)) {
                double height = args.get("height").asDouble();
                double weight = args.get("weight").asDouble();
                String gender = args.has("gender") ? args.get("gender").asText() : "Nam";
                String fitPreference = args.has("fitPreference") ? args.get("fitPreference").asText() : "fit";

                String recommendedSize = "M"; // default

                if (gender.equalsIgnoreCase("Nữ") || gender.equalsIgnoreCase("Nu") || gender.equalsIgnoreCase("Female")) {
                    if (height < 155) {
                        recommendedSize = (weight < 45) ? "S" : ((weight < 52) ? "M" : "L");
                    } else if (height <= 165) {
                        recommendedSize = (weight < 48) ? "S" : ((weight < 56) ? "M" : ((weight < 62) ? "L" : "XL"));
                    } else {
                        recommendedSize = (weight < 55) ? "M" : ((weight < 65) ? "L" : "XL");
                    }
                } else { // Nam / Male / Mặc định
                    if (height < 165) {
                        recommendedSize = (weight < 55) ? "S" : ((weight < 65) ? "M" : "L");
                    } else if (height <= 175) {
                        recommendedSize = (weight < 62) ? "M" : ((weight < 72) ? "L" : "XL");
                    } else {
                        recommendedSize = (weight < 70) ? "L" : ((weight < 82) ? "XL" : "XXL");
                    }
                }

                // Điều chỉnh theo sở thích phom dáng mặc
                if ("loose".equalsIgnoreCase(fitPreference)) {
                    if (recommendedSize.equals("S")) recommendedSize = "M";
                    else if (recommendedSize.equals("M")) recommendedSize = "L";
                    else if (recommendedSize.equals("L")) recommendedSize = "XL";
                    else if (recommendedSize.equals("XL")) recommendedSize = "XXL";
                } else if ("tight".equalsIgnoreCase(fitPreference)) {
                    if (recommendedSize.equals("XXL")) recommendedSize = "XL";
                    else if (recommendedSize.equals("XL")) recommendedSize = "L";
                    else if (recommendedSize.equals("L")) recommendedSize = "M";
                    else if (recommendedSize.equals("M")) recommendedSize = "S";
                }

                result.put("height", height);
                result.put("weight", weight);
                result.put("gender", gender);
                result.put("recommendedSize", recommendedSize);

            } else if ("getActiveCoupons".equals(functionName)) {
                List<Coupon> activeCoupons = couponRepository.findByIsActiveTrue();
                ArrayNode couponsArray = objectMapper.createArrayNode();
                for (Coupon c : activeCoupons) {
                    ObjectNode cNode = objectMapper.createObjectNode();
                    cNode.put("code", c.getCode());
                    cNode.put("discountType", c.getDiscountType());
                    cNode.put("discountValue", c.getDiscountValue());
                    cNode.put("minOrderValue", c.getMinOrderValue());
                    couponsArray.add(cNode);
                }
                result.set("coupons", couponsArray);
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "Lỗi thực thi hàm: " + e.getMessage());
        }

        return result;
    }
}
