package bobo.chess.game;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ResponseBody;

import bobo.chess.game.Chess.Black;
import bobo.chess.game.Chess.Red;
import lombok.Data;

@Data
@ResponseBody
public class Game {
	private Map<Byte, Black> blacks;
	private Map<Byte, Red> reds;

	public Game() {
		reds = new HashMap<>();
		blacks = new HashMap<>();
		reds.put(null, null);
	}

	public void move(boolean red, int xfrom, int yfrom, int xto, int yto) {
		Chess c = red ? reds.get(hashPos(xfrom, yfrom)) : blacks.get(hashPos(xfrom, yfrom));

	}

	public Red getRed(int x, int y) {
		return reds.get(hashPos(x, y));
	}

	public Black getBlack(int x, int y) {
		return blacks.get(hashPos(x, y));
	}

	private byte hashPos(int x, int y) {
		return (byte) (x << 4 | y);
	}

	private int[] dehashPos(byte b) {
		return new int[] { b >>> 4, b & 0xf };
	}

	private short hashMove(int from, int to) {
		return (short) (from << 8 | to);
	}

	private int[] dehashMove(short move) {
		return new int[] { move >>> 8, move & 0xff };
	}
}