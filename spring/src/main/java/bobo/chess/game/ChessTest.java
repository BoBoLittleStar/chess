package bobo.chess.game;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.util.Map;
import java.util.Set;

import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class ChessTest {
	public static void main(String[] args) {
		Game game = new Game();
		game.setRedId("red");
		game.setBlackId("black");
		game.setReady("red");
		game.setReady("black");
		print(game, 0);
		print(game, game.move(2, 0, 4, 2));
		print(game, game.move(2, 0, 4, 2));
		print(game, game.move(1, 2, 1, 9));
		print(game, game.move(8, 0, 7, 0));
		print(game, game.move(2, 3, 2, 4));
		print(game, game.move(6, 3, 6, 4));
		print(game, game.move(2, 4, 2, 5));
		print(game, game.move(4, 2, 6, 4));
		System.exit(0);
	}

	private static void print(Game g, int move) {
		if (move == -1)
			System.out.println("invalid move");
		else {
			JPanel p = new JPanel() {
				private final Map<Integer, Chess> reds = g.getReds();
				private final Map<Integer, Chess> blacks = g.getBlacks();
				private static final long serialVersionUID = 1L;
				{
					setPreferredSize(new Dimension(32 * 9, 32 * 10));
				}

				@Override
				public void paintComponent(Graphics g) {
					for (int x = 0; x <= 9; x++)
						g.drawLine(x * 32, 0, x * 32, 32 * 10);
					for (int y = 0; y <= 10; y++)
						g.drawLine(0, y * 32, 32 * 9, y * 32);
					g.setColor(Color.red);
					Set<Integer> set = reds.keySet();
					for (int pos : set)
						g.drawString(switch (reds.get(pos)) {
						case BISHOP -> "相";
						case CANNON -> "炮";
						case GUARD -> "仕";
						case KING -> "帅";
						case KNIGHT -> "马";
						case ROOK -> "车";
						case SOLDIER -> "兵";
						}, (8 - (pos >>> 4)) * 32 + 10, (9 - (pos & 0xf) + 1) * 32 - 12);
					g.setColor(Color.black);
					set = blacks.keySet();
					for (int pos : set)
						g.drawString(switch (blacks.get(pos)) {
						case BISHOP -> "象";
						case CANNON -> "炮";
						case GUARD -> "仕";
						case KING -> "将";
						case KNIGHT -> "马";
						case ROOK -> "车";
						case SOLDIER -> "卒";
						}, (pos >>> 4) * 32 + 10, ((pos & 0xf) + 1) * 32 - 12);
				}
			};
			JOptionPane.showMessageDialog(null, p);
		}
	}
}