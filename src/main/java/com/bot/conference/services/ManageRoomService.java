package com.bot.conference.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bot.conference.domain.Room;
import com.bot.conference.domain.RoomService;

@Service
public class ManageRoomService implements IManageRoomService{
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	private RoomService roomService;
	
	public ManageRoomService(RoomService roomService) {
		super();
		// TODO Auto-generated constructor stub
		this.roomService = roomService;
	}
	
	@Override
	public Boolean createNewRoom(String roomUniqueId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		if(roomUniqueId != null) {
			logger.info("Trying to create new room of id: #{}", roomUniqueId);
			
			Room room = new Room(roomUniqueId);
			flag = roomService.addRoom(room);
		}
		return flag;
	}
}
