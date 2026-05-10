FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -q -Dmaven.test.skip=true package

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/finantz-backend-0.1.0.jar ./finantz-backend.jar
EXPOSE 8080
CMD ["java", "-jar", "finantz-backend.jar"]
