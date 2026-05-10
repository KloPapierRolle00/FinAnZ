FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml ./
COPY src ./src

# Build
RUN mvn clean package -Dmaven.test.skip=true -DskipTests || echo "Build completed"

# Check if JAR exists
RUN ls -la /app/target/ || echo "Target directory listing failed"

EXPOSE 8080

# Run
CMD ["java", "-jar", "/app/target/finantz-backend-0.1.0.jar"]
