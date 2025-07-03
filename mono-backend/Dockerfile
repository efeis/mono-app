FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:resolve

# Copy source code
COPY src ./src

# Expose port
EXPOSE 8080

# Run the application
CMD ["./mvnw", "spring-boot:run"]