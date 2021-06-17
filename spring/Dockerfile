FROM gradle:7.1.0-jdk16
WORKDIR /spring
COPY . .
RUN ["./gradlew", "clean", "build"]
FROM openjdk:15
WORKDIR /spring
COPY --from=0 /spring/build/libs/*.jar .
ENTRYPOINT ["java", "-jar", "spring-1.0.jar"]
