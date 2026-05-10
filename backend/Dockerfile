FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /app

# Download dependencies erst
COPY pom.xml ./
RUN mvn dependency:go-offline -B 2>&1 || echo "Dependency download attempt completed"

# Build
COPY src ./src
RUN mvn -B -Dmaven.test.skip=true -DskipTests clean package 2>&1 | head -100

# Runtime
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/finantz-backend-*.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
