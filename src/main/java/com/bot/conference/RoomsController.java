package com.bot.conference;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bot.conference.domain.Room;
import com.bot.conference.services.IManageRoomService;

@RestController
public class RoomsController {

	@Autowired
	private IManageRoomService manageRoomService;

	@CrossOrigin(origins = "https://192.168.0.101:8080")
	@PostMapping("/createRoom")
	public ResponseEntity<String> createRoom(@RequestBody final Room room) {
		Boolean flag = this.manageRoomService.createNewRoom(room.getRoomId());
		String message = "Fail to create room. Please contact admin.";
		if (flag)
			message = "Room created successfully";
		return ResponseEntity.ok(message);
	}
	
	@GetMapping("/test")
	public ResponseEntity<String> test() {
		return ResponseEntity.ok("hello user");
	}
}
