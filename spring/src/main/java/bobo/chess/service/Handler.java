package bobo.chess.service;

import java.io.IOException;
import java.util.Map;
import java.util.Queue;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import bobo.chess.game.Game;

public class Handler extends TextWebSocketHandler {
	private Map<String, String> sessions = new ConcurrentHashMap<>();
	private Map<String, WebSocketSession> users = new ConcurrentHashMap<>();
	private Map<String, String> names = new ConcurrentHashMap<>();
	private Queue<String> awaitingQueue = new ArrayBlockingQueue<>(10000);
	private Set<String> awaitingSet = ConcurrentHashMap.newKeySet();
	private Map<String, String> oppos = new ConcurrentHashMap<>();
	private Map<String, Game> games = new ConcurrentHashMap<>();
	private Map<String, Set<String>> spectators = new ConcurrentHashMap<>();

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
						createMatch(user1, user2);
				}
			} catch (InterruptedException E) {
				E.printStackTrace();
			} catch (IOException E) {
				E.printStackTrace();
			}
		}).start();
	}

	private TextMessage message(String str) {
		return new TextMessage(str);
	}

	private void handleSessionOpen(String sessionId, String userId, WebSocketSession session, JsonNode payload) {
		sessions.put(sessionId, userId);
		users.put(userId, session);
		names.put(userId, payload.get("name").asText());
		handleRestore(userId);
		users.values().forEach(this::countOnlines);
	}

	private void handleSessionClose(WebSocketSession session) {
		String userId = sessions.remove(session.getId());
		users.remove(userId);
		names.remove(userId);
		awaitingSet.remove(userId);
		spectators.remove(userId);
		users.values().forEach(this::countOnlines);
	}

	private void handleRestore(String userId) {
		Game game = games.get(userId);
		if (game != null)
			try {
				users.get(userId).sendMessage(message(
						new ObjectConstructor().put("matchedOpponent", names.get(oppos.get(userId))).toString()));
				if (game.isStarted())
					handleSendGame(userId, game);
			} catch (IOException e) {
				e.printStackTrace();
			}
	}

	private void countOnlines(WebSocketSession session) {
		try {
			session.sendMessage(message(new ObjectConstructor().put("onlineCount", users.size()).toString()));
		} catch (IOException E) {
			E.printStackTrace();
		}
	}

	private void handleMatchPlayer(String userId, boolean matching) {
		if (matching) {
			awaitingQueue.offer(userId);
			awaitingSet.add(userId);
		} else
			awaitingSet.remove(userId);
	}

	private void createMatch(String user1, String user2) throws IOException {
		oppos.put(user1, user2);
		oppos.put(user2, user1);
		Game game = new Game();
		games.put(user1, game);
		games.put(user2, game);
		users.get(user1)
				.sendMessage(message(new ObjectConstructor().put("matchedOpponent", names.get(user2)).toString()));
		users.get(user2)
				.sendMessage(message(new ObjectConstructor().put("matchedOpponent", names.get(user1)).toString()));
	}

	private void handlePlayerReady(String userId, boolean ready) {
		try {
			String oppoId = oppos.get(userId);
			if (oppoId != null) {
				WebSocketSession session = users.get(oppoId);
				if (session != null)
					if (ready)
						session.sendMessage(message(new ObjectConstructor().put("opponentStatus", "ready").toString()));
					else
						session.sendMessage(message(new ObjectConstructor().put("opponentStatus", "left")
								.put("matchedOpponent", "null").toString()));
				if (ready) {
					Game game = games.get(userId);
					synchronized (game) {
						if (game.isEmpty()) {
							boolean flag = new Random().nextBoolean();
							game.setRedId(flag ? userId : oppoId);
							game.setBlackId(flag ? oppoId : userId);
							game.setReady(userId);
						} else {
							game.setReady(userId);
							handleSendGame(oppoId, game);
							handleSendGame(userId, game);
						}
					}
				} else {
					games.remove(userId);
					games.remove(oppoId);
					oppos.remove(userId);
					oppos.remove(oppoId);
				}
			}
		} catch (IOException E) {
			E.printStackTrace();
		}
	}

	private void handleSendGame(String userId, Game game) {
		try {
			users.get(userId).sendMessage(message(new ObjectConstructor()
					.put("currentGame", new ObjectMapper().writeValueAsString(game)).toString()));
		} catch (JsonProcessingException E) {
			E.printStackTrace();
		} catch (IOException E) {
			E.printStackTrace();
		}
	}

	private void handlePlayerMove(String userId, int from, int to) {
		int xfrom = from >>> 4;
		int yfrom = from & 0xf;
		int xto = to >>> 4;
		int yto = to & 0xf;
		Game game = games.get(userId);
		if (game.move(xfrom, yfrom, xto, yto) != -1) {
			handleSendGame(userId, game);
			handleSendGame(oppos.get(userId), game);
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		handleSessionClose(session);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		JsonNode payload = new ObjectMapper().readTree(message.getPayload());
		String command = payload.get("command").asText();
		String userId = payload.get("id").asText();
		payload = payload.get("payload");
		switch (command) {
		case "open" -> handleSessionOpen(session.getId(), userId, session, payload);
		case "rename" -> names.put(userId, payload.get("name").asText());
		case "match" -> handleMatchPlayer(userId, payload.get("match").asBoolean());
		case "ready" -> handlePlayerReady(userId, payload.get("ready").asBoolean());
		case "move" -> handlePlayerMove(userId, payload.get("from").asInt(), payload.get("to").asInt());
		default -> System.out.println(command);
		}
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