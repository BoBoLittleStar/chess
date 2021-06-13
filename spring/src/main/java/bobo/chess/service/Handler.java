package bobo.chess.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Handler extends TextWebSocketHandler {
	private Map<String, String> sessions = new ConcurrentHashMap<>();
	private Map<String, WebSocketSession> users = new ConcurrentHashMap<>();

	private void sendOnlineCount(WebSocketSession session) {
		try {
			session.sendMessage(new TextMessage("{\"onlines\":" + users.size() + "}"));
		} catch (IOException E) {
			E.printStackTrace();
		}
	}

	private void route(WebSocketSession session, String id, String command) throws Exception {
		switch (command) {
		case "open" -> {
			Thread.sleep(5);
			sessions.put(session.getId(), id);
			users.put(id, session);
			users.values().forEach(this::sendOnlineCount);
		}
		default -> System.out.println(command);
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		users.remove(sessions.remove(session.getId()));
		users.values().forEach(this::sendOnlineCount);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		JsonNode object = new ObjectMapper().readTree(message.getPayload());
		route(session, object.get("id").asText(), object.get("data").asText());
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable E) throws Exception {
		session.close(new CloseStatus(1011, E.getMessage()));
		E.printStackTrace();
	}

	@Override
	public boolean supportsPartialMessages() {
		return false;
	}
}