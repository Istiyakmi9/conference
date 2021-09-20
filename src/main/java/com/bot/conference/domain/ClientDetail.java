package com.bot.conference.domain;

import org.springframework.web.socket.WebSocketSession;

public class ClientDetail {
	private String clientName;
	private String roomId;
	private WebSocketSession session;

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public WebSocketSession getSession() {
		return session;
	}

	public void setSession(WebSocketSession session) {
		this.session = session;
	}

	@Override
	public String toString() {
		return "ClientDetail [clientName=" + clientName + ", roomId=" + roomId + ", session=" + session + "]";
	}
}
