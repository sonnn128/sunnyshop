### How To Run The App
```
1. cd <project>
2. cp .env.example .env
3. docker compose up -d
visit http://localhost:5173 to access the app
```

### backup: 
docker exec trendwearshop-mysql-1 \
  mysqldump -u trendwearshop -ptrendwearshop --no-tablespaces trendwearshop > trendwearshop.sql


### Admin 
username: admin
passsword: admin123

### User
username: sonvipkl04@gmail.com 
password: sonvipkl04@gmail.com 