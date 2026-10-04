package com.creme.shared.api;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler({IllegalArgumentException.class, ConstraintViolationException.class,
			MethodArgumentNotValidException.class})
	public ResponseEntity<Map<String, Object>> handleBadRequest(Exception exception) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
				"timestamp", Instant.now().toString(),
				"status", 400,
				"code", "BAD_REQUEST",
				"message", exception.getMessage() == null ? "Request is invalid" : exception.getMessage()));
	}
}
