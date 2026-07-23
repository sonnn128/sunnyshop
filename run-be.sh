#!/bin/bash

# Chuyển đến thư mục project
cd /d/HaUI/DATN/ChuHaiDang/3.code/api-server || {
    echo "Không tìm thấy thư mục project!"
    exit 1
}

# Build project
mvn clean install -DskipTests

# Nếu build thành công thì chạy ứng dụng
if [ $? -eq 0 ]; then
    java -jar ./target/trendwearshop-0.0.1-SNAPSHOT.jar
else
    echo "Build thất bại!"
    exit 1
fi