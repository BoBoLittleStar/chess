package bobo.chess.game;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class Game {
	private String redId;
	private String blackId;
	private Map<Integer, Chess> reds;
	private Map<Integer, Chess> blacks;
	private final List<Integer> moves;

	public Game() {
		moves = new LinkedList<>();
	}

	public void setReady(String userId) {
		Map<Integer, Chess> map;
		if (userId.equals(redId))
			map = reds = new HashMap<>();
		else if (userId.equals(blackId))
			map = blacks = new HashMap<>();
		else
			throw new RuntimeException(userId);
		map.put(hashPos(0, 0), Chess.ROOK);
		map.put(hashPos(1, 0), Chess.KNIGHT);
		map.put(hashPos(2, 0), Chess.BISHOP);
		map.put(hashPos(3, 0), Chess.GUARD);
		map.put(hashPos(4, 0), Chess.KING);
		map.put(hashPos(5, 0), Chess.GUARD);
		map.put(hashPos(6, 0), Chess.BISHOP);
		map.put(hashPos(7, 0), Chess.KNIGHT);
		map.put(hashPos(8, 0), Chess.ROOK);
		map.put(hashPos(1, 2), Chess.CANNON);
		map.put(hashPos(7, 2), Chess.CANNON);
		map.put(hashPos(0, 3), Chess.SOLDIER);
		map.put(hashPos(2, 3), Chess.SOLDIER);
		map.put(hashPos(4, 3), Chess.SOLDIER);
		map.put(hashPos(6, 3), Chess.SOLDIER);
		map.put(hashPos(8, 3), Chess.SOLDIER);
	}

	@JsonIgnore
	public boolean isEmpty() {
		return reds == null && blacks == null;
	}

	@JsonIgnore
	public boolean isStarted() {
		return reds != null && blacks != null;
	}

	public String getPlayer() {
		return (moves.size() & 1) == 0 ? redId : blackId;
	}

	private Chess getChess(int x, int y, boolean rotate) {
		if (rotate) {
			x = 8 - x;
			y = 9 - y;
		}
		Chess c = reds.get(hashPos(x, y));
		if (c == null)
			c = blacks.get(hashPos(8 - x, 9 - y));
		return c;
	}

	public int move(int xfrom, int yfrom, int xto, int yto) {
		if (xto < 0 || xto > 8 || yto < 0 || yto > 9)
			return -1;
		boolean isRedMove = (moves.size() & 1) == 0;
		Chess redAtDest = reds.get(isRedMove ? hashPos(xto, yto) : hashPos(8 - xto, 9 - yto));
		Chess blackAtDest = blacks.get(isRedMove ? hashPos(8 - xto, 9 - yto) : hashPos(xto, yto));
		if (isRedMove ? redAtDest != null : blackAtDest != null)
			return -1;
		Chess chessMoving = isRedMove ? reds.get(hashPos(xfrom, yfrom)) : blacks.get(hashPos(xfrom, yfrom));
		if (chessMoving == null)
			return -1;
		switch (chessMoving) {
		case BISHOP -> {
			if (Math.abs(xto - xfrom) != 2 || Math.abs(yto - yfrom) != 2)
				return -1;
			if (yto > 4)
				return -1;
			int xmid = (xto + xfrom) / 2;
			int ymid = (yto + yfrom) / 2;
			if (getChess(xmid, ymid, isRedMove) != null)
				return -1;
		}
		case CANNON -> {
			boolean taking = redAtDest != null || blackAtDest != null;
			if (xto != xfrom && yto != yfrom)
				return -1;
			if (xto == xfrom) {
				boolean forward = yto > yfrom;
				for (int y = forward ? yto - 1 : yto + 1; y != yfrom; y = forward ? y - 1 : y + 1)
					if (getChess(xto, y, isRedMove) != null)
						if (taking)
							taking = false;
						else
							return -1;
			} else {
				boolean right = xto > xfrom;
				for (int x = right ? xto - 1 : xto + 1; x != xfrom; x = right ? x - 1 : x + 1)
					if (getChess(x, yto, isRedMove) != null)
						if (taking)
							taking = false;
						else
							return -1;
			}
		}
		case GUARD -> {
			if (Math.abs(xto - xfrom) != 1 || Math.abs(yto - yfrom) != 1)
				return -1;
			if (xto < 3 || xto > 5 || yto > 2)
				return -1;
		}
		case KING -> {
			if (xto < 3 || xto > 5 || yto > 2)
				return -1;
			if (xto != xfrom && yto != yfrom)
				return -1;
			if (Math.abs(xto - xfrom) != 1 && Math.abs(yto - yfrom) != 1)
				return -1;
		}
		case KNIGHT -> {
			if (xto == xfrom || yto == yfrom)
				return -1;
			if (Math.abs(xto - xfrom) + Math.abs(yto - yfrom) != 3)
				return -1;
			if (Math.abs(xto - xfrom) == 2 && getChess((xto + xfrom) / 2, yfrom, isRedMove) != null)
				return -1;
			if (Math.abs(yto - yfrom) == 2 && getChess(xfrom, (yto + yfrom) / 2, isRedMove) != null)
				return -1;
		}
		case ROOK -> {
			if (xto != xfrom && yto != yfrom)
				return -1;
			if (xto == xfrom) {
				boolean forward = yto > yfrom;
				for (int y = forward ? yto - 1 : yto + 1; y != yfrom; y = forward ? y - 1 : y + 1)
					if (getChess(xto, y, isRedMove) != null)
						return -1;
			} else {
				boolean right = xto > xfrom;
				for (int x = right ? xto - 1 : xto + 1; x != xfrom; x = right ? x - 1 : x + 1)
					if (getChess(x, yto, isRedMove) != null)
						return -1;
			}
		}
		case SOLDIER -> {
			if (yto != yfrom && yto != yfrom + 1)
				return -1;
			if (xto != xfrom && (yto < 5 || yto != yfrom))
				return -1;
		}
		}
		var v = isRedMove ? reds : blacks;
		v.put(hashPos(xto, yto), v.remove(hashPos(xfrom, yfrom)));
		int move = hashMove(hashPos(xfrom, yfrom), hashPos(xto, yto), isRedMove ? blackAtDest : redAtDest);
		moves.add(move);
		(isRedMove ? blacks : reds).remove(hashPos(8 - xto, 9 - yto));
		return move;
	}

	private int hashPos(int x, int y) {
		return x << 4 | y;
	}

	private int hashMove(int from, int to, Chess c) {
		int i = from << 8 | to;
		return c != null ? i | c.ordinal() + 1 << 16 : i;
	}
}