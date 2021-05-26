FROM gradle:7.0.2-jdk11
WORKDIR /spring
COPY . .
RUN ["./gradlew", "clean", "build"]
FROM openjdk:11
WORKDIR /spring
COPY --from=0 /spring/build/libs/*.jar .
ENTRYPOINT ["java", "-jar", "spring-1.0.jar"]
