FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml ./
COPY src ./src

# Build mit detailliertem Output
RUN mvn clean package -Dmaven.test.skip=true -DskipTests 2>&1 | tee build.log

# Wenn der Build fehlschlägt, zeig den Log
RUN if [ ! -f target/finantz-backend-0.1.0.jar ]; then echo "BUILD FAILED"; cat build.log; exit 1; fi

EXPOSE 8080

CMD ["java", "-jar", "/app/target/finantz-backend-0.1.0.jar"]
