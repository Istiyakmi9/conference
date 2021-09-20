package com.bot.conference.domain;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import javax.validation.constraints.NotNull;

public class Room {
	@NotNull
	private String roomId;

	private Map<String, ClientDetail> clients = new ConcurrentHashMap<>();

	public Room() {}
	
	public Room(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomId() {
		return roomId;
	}

	public Map<String, ClientDetail> getClients() {
		return clients;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public void setClients(Map<String, ClientDetail> clients) {
		this.clients = clients;
	}

	@Override
	public int hashCode() {
		return Objects.hash(clients, roomId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Room other = (Room) obj;
		return Objects.equals(clients, other.clients) && Objects.equals(roomId, other.roomId);
	}

	@Override
	public String toString() {
		return "Room [roomId=" + roomId + ", clients=" + clients + "]";
	}
}
