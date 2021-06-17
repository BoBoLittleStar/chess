package bobo.chess.service;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectConstructor {
	private Map<String, Object> map = new HashMap<>();

	public ObjectConstructor put(String k, Object v) {
		map.put(k, v);
		return this;
	}

	@Override
	public String toString() {
		try {
			return new ObjectMapper().writeValueAsString(map);
		} catch (JsonProcessingException E) {
			E.printStackTrace();
			return null;
		}
	}
}