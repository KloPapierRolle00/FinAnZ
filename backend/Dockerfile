FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -B clean package -Dmaven.test.skip=true -DskipTests
RUN ls -la /app/target

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/finantz-backend-0.1.0.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
