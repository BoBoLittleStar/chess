package bobo.chess.game;

import org.springframework.web.bind.annotation.ResponseBody;

@ResponseBody
public interface Chess {
	public enum Red implements Chess {
		JU, MA, PAO, SHI, XIANG, SHUAI, BING;
	}

	public enum Black implements Chess {
		JU, MA, PAO, SHI, XIANG, JIANG, ZU;
	}
}