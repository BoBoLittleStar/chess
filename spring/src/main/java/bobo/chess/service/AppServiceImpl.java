package bobo.chess.service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import bobo.chess.game.Game;

@Component
public class AppServiceImpl implements AppService {
	private String cur1, cur2;
	private final Map<String, Long> queue = new ConcurrentHashMap<>();
	private final Map<String, Game> games = new ConcurrentHashMap<>();

	public AppServiceImpl() {
		new Thread(() -> {
			while (true) {
				Set<String> ids = new HashSet<>(queue.keySet());
				long ms = System.currentTimeMillis();
				ids.forEach((id) -> {
					if (ms - queue.get(id) > 2000)
						queue.remove(id);
				});
				try {
					Thread.sleep(5000);
				} catch (InterruptedException E) {
					E.printStackTrace();
				}
			}
		}).start();
	}

	@Override
	public long refresh(String id) {
		try {
			long ms = System.currentTimeMillis();
			queue.put(id, ms);
			Thread.sleep(500);
			return ms;
		} catch (InterruptedException E) {
			throw new RuntimeException(E);
		}
	}

	@Override
	public synchronized String match(String k) {
		try {
			if (cur1 == null || cur1.equals(k) || !queue.containsKey(cur1)) {
				cur1 = k;
				wait();
				String id = cur2;
				cur1 = cur2 = null;
				return id;
			} else {
				cur2 = k;
				notifyAll();
				return cur1;
			}
		} catch (InterruptedException E) {
			throw new RuntimeException(E);
		}
	}

	@Override
	public Game ready(String id, String oppo) {
		return null;
	}

	@Override
	public boolean isInGame(String id) {
		return games.containsKey(id);
	}
}