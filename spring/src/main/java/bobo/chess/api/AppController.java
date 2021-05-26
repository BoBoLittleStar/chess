package bobo.chess.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bobo.chess.game.Game;
import bobo.chess.service.AppService;

@CrossOrigin
@RestController
@RequestMapping("api")
public class AppController {
	private final AppService service;

	public AppController(AppService service) {
		this.service = service;
	}

	@GetMapping("test")
	public String get() {
		return "success";
	}

	@PutMapping("refresh")
	public long refresh(@RequestBody String id) {
		return service.refresh(id);
	}

	@PostMapping("match")
	public String match(@RequestBody String id) {
		return service.match(id);
	}

	@PostMapping("ready")
	public Game ready(@RequestBody String[] ids) {
		return service.ready(ids[0], ids[1]);
	}
}