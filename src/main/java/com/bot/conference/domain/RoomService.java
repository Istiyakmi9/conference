package com.bot.conference.domain;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bot.conference.util.Parser;

@Service
public class RoomService {
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	private final Parser parser;
	
	private final Set<Room> rooms = new TreeSet<>(Comparator.comparing(Room::getRoomId));
	
	@Autowired
	public RoomService(final Parser parser) {
		this.parser = parser;
	}
	
	public Set<Room> getRooms() {
		final TreeSet<Room> defensiveCopy = new TreeSet<>(Comparator.comparing(Room::getRoomId));
		defensiveCopy.addAll(rooms);
		return defensiveCopy;
	}
	
	public Boolean addRoom(final Room room) {
		Optional<Room> availableRoom = findRoomByUid(room.getRoomId().toString());
		logger.info("Result: {}", availableRoom);
		if(availableRoom.isEmpty()) {
			logger.info("Room id #{} is not exits. Creating new one...", room.getRoomId());
			return rooms.add(room);	
		} else {
			logger.info("Room id #{} is alredy exists.", room.getRoomId());
		}
		return false;
	}

	public Optional<Room> findRoomByUid(final String uid){
		Stream<Room> roomStream =  rooms.stream();
		Optional<Room> optionalRoom = roomStream.filter(x -> x.getRoomId().equals(uid)).findAny();
		return optionalRoom;
	}
	
	public Room findRoombySessionId(final String sessionId) {
		Room room = null;
		Boolean roomFound = false;
		
		for(Room filterRoom : rooms) {
			for(Map.Entry<String, ClientDetail> elem : filterRoom.getClients().entrySet()) {
				if(elem.getValue().getSession().getId().equals(sessionId)) {
					roomFound = true;
					break;
				}
			}
			
			if(roomFound) {
				room = filterRoom;
				break;
			}
		}
		
		return room;
	}
	
	public String getRoomId(Room room) {
		return room.getRoomId();
	}
	
	public Map<String, ClientDetail> getClients(final Room room) {
		return Optional.ofNullable(room)
		.map(x -> Collections.unmodifiableMap(x.getClients()))
		.orElse(Collections.emptyMap());
	}	
	
	public ClientDetail addClient(final Room room, final String name, final ClientDetail clientDetail) {
		return room.getClients().put(name, clientDetail);
	}
	
	public ClientDetail removeClientByName(final Room room, final String clientId) {
		ClientDetail clientDetail = room.getClients().remove(clientId);
		closeRoomIfEmpty(room.getRoomId());
		return clientDetail;
	}
	
	public Boolean removeClientFromRoom(String sessionId) {
		Boolean flag = false;
		Room room = findRoombySessionId(sessionId);
		if(room != null) {
			Optional<String> client = getClients(room).entrySet().stream()
					.filter(x -> Objects.equals(x.getValue().getSession().getId(), sessionId))
					.map(Map.Entry::getKey).findAny();
			client.ifPresent(r -> removeClientByName(room, r));
			
			flag = true;
		}
		return flag;
	}
	
	public Boolean ifRoomExists(String sessionId) {
		Boolean flag = true;
		Room room = findRoombySessionId(sessionId);
		if(room == null)
			flag = false;
		return flag;
	}
	
	private void closeRoomIfEmpty(String roomId) {
		Optional<Room> room = rooms.stream().filter(x -> x.getRoomId().equals(roomId)).findFirst();
		if(room.get().getClients().isEmpty()) {
			rooms.removeIf(x -> x.getRoomId().equals(roomId));
		}
	}
}
