# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache deps first
COPY pom.xml .
RUN mvn -q -B -DskipTests dependency:go-offline

# Copy sources and build
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENV JAVA_OPTS=""

# Use H2 demo profile
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar --spring.profiles.active=demo"]
