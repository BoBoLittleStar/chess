package bobo.chess.service;

import java.io.IOException;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
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
	private Map<String, String> names = new ConcurrentHashMap<>();
	private Queue<String> awaitingQueue = new ArrayBlockingQueue<>(10000);
	private Set<String> awaitingSet = ConcurrentHashMap.newKeySet();

	public Handler() {
		new Thread(() -> {
			try {
				while (true) {
					String user1, user2;
					boolean flag;
					while ((flag = awaitingQueue.isEmpty()) || !awaitingSet.contains(user1 = awaitingQueue.poll()))
						if (flag)
							Thread.sleep(1000);
					while (true) {
						while ((flag = awaitingQueue.isEmpty()) || !awaitingSet.contains(user2 = awaitingQueue.poll()))
							if (flag)
								Thread.sleep(1000);
						if (!user1.equals(user2) && awaitingSet.contains(user1))
							break;
						user1 = user2;
					}
					if (awaitingSet.remove(user1) && awaitingSet.remove(user2))
						matchPlayers(user1, user2);
				}
			} catch (InterruptedException E) {
				E.printStackTrace();
			} catch (IOException E) {
				E.printStackTrace();
			}
		}).start();
	}

	private void countOnlines(WebSocketSession session) {
		try {
			session.sendMessage(new TextMessage("{\"onlines\":" + users.size() + "}"));
		} catch (IOException E) {
			E.printStackTrace();
		}
	}

	private void matchPlayers(String user1, String user2) throws IOException {
		users.get(user1).sendMessage(new TextMessage("{\"matched\":\"" + names.get(user2) + "\"}"));
		users.get(user2).sendMessage(new TextMessage("{\"matched\":\"" + names.get(user1) + "\"}"));
	}

	private void command(WebSocketSession session, JsonNode object) {
		String sessionId = session.getId();
		String command = object.get("command").asText();
		String userId = object.get("id").asText();
		object = object.get("payload");
		switch (command) {
		case "open" -> {
			sessions.put(sessionId, userId);
			users.put(userId, session);
			names.put(userId, object.get("name").asText());
			users.values().forEach(this::countOnlines);
		}
		case "rename" -> {
			names.put(userId, object.get("name").asText());
		}
		case "match" -> {
			awaitingQueue.offer(userId);
			awaitingSet.add(userId);
		}
		case "match-cancel" -> {
			awaitingSet.remove(userId);
		}
		case "ready" -> {

		}
		case "ready-cancel" -> {

		}
		default -> System.out.println(command);
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		String userId = sessions.remove(session.getId());
		users.remove(userId);
		names.remove(userId);
		awaitingSet.remove(userId);
		users.values().forEach(this::countOnlines);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		JsonNode object = new ObjectMapper().readTree(message.getPayload());
		command(session, object);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable E) throws Exception {
		E.printStackTrace();
	}

	@Override
	public boolean supportsPartialMessages() {
		return false;
	}
}