package com.sonnguyen.laptopshop.utils;

import com.sonnguyen.laptopshop.model.Product;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] HEADERS = { "Name", "Price", "Image URL", "Description", "Quantity", "Factory", "Target", "Category" };
    static String SHEET = "Products";

    public static boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    public static ByteArrayInputStream productsToExcelTemplate() {

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(SHEET);

            // Header
            Row headerRow = sheet.createRow(0);

            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }
            
            // Add a sample row
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("Example Laptop");
            sampleRow.createCell(1).setCellValue(1000.0);
            sampleRow.createCell(2).setCellValue("https://example.com/image.jpg");
            sampleRow.createCell(3).setCellValue("Short description");
            sampleRow.createCell(4).setCellValue(10);
            sampleRow.createCell(5).setCellValue("Dell");
            sampleRow.createCell(6).setCellValue("Gaming");
            sampleRow.createCell(7).setCellValue("Laptop Gaming");

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public static List<Product> excelToProducts(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);

            Sheet sheet = workbook.getSheet(SHEET);
            if (sheet == null) {
                // Try getting the first sheet if "Products" sheet doesn't exist
                sheet = workbook.getSheetAt(0);
            }
            
            Iterator<Row> rows = sheet.iterator();

            List<Product> products = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();

                Product product = new Product();

                // Use index based iteration to handle blank cells correctly
                for (int cellIdx = 0; cellIdx < HEADERS.length; cellIdx++) {
                   Cell currentCell = currentRow.getCell(cellIdx, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                   
                    switch (cellIdx) {
                    case 0:
                        product.setName(getCellValueAsString(currentCell));
                        break;
                    case 1:
                        product.setPrice(getCellValueAsDouble(currentCell));
                        break;
                    case 2:
                        product.setImage(getCellValueAsString(currentCell));
                        break;
                    case 3:
                        product.setDescription(getCellValueAsString(currentCell));
                        break;
                    case 4:
                        product.setQuantity((long) getCellValueAsDouble(currentCell));
                        break;
                    case 5:
                        product.setFactory(getCellValueAsString(currentCell));
                        break;
                    case 6:
                        product.setTarget(getCellValueAsString(currentCell));
                        break;
                    case 7:
                        String categoryName = getCellValueAsString(currentCell);
                        if (categoryName != null && !categoryName.isEmpty()) {
                            com.sonnguyen.laptopshop.model.Category category = new com.sonnguyen.laptopshop.model.Category();
                            category.setName(categoryName);
                            product.setCategory(category);
                        }
                        break;
                    default:
                        break;
                    }
                }

                // Only add if name is not empty
                if (product.getName() != null && !product.getName().isEmpty()) {
                    products.add(product);
                }
            }

            workbook.close();

            return products;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }
    
    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        try {
            switch (cell.getCellType()) {
                case STRING:
                    return cell.getStringCellValue();
                case NUMERIC:
                    return String.valueOf(cell.getNumericCellValue());
                case BOOLEAN:
                    return String.valueOf(cell.getBooleanCellValue());
                default:
                    return "";
            }
        } catch (Exception e) {
            return "";
        }
    }
    
    private static double getCellValueAsDouble(Cell cell) {
        if (cell == null) return 0;
        try {
            switch (cell.getCellType()) {
                case NUMERIC:
                    return cell.getNumericCellValue();
                case STRING:
                    return Double.parseDouble(cell.getStringCellValue());
                default:
                    return 0;
            }
        } catch (Exception e) {
            return 0;
        }
    }
}
