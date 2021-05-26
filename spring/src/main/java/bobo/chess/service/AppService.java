package bobo.chess.service;

import org.springframework.stereotype.Service;

import bobo.chess.game.Game;

@Service
public interface AppService {
	String match(String id);

	long refresh(String id);

	Game ready(String id, String oppo);

	boolean isInGame(String id);
}