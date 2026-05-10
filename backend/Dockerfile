FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Build mit verbose output
RUN mvn -X clean package -Dmaven.test.skip=true -DskipTests

# Runtime
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Kopiere das JAR und zeige an was da ist
COPY --from=builder /app/target/*.jar ./app.jar
RUN ls -la /app/

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
