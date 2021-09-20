package com.bot.conference.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.bot.conference.domain.ClientDetail;
import com.bot.conference.domain.Room;
import com.bot.conference.domain.RoomService;
import com.bot.conference.models.Constants;
import com.bot.conference.models.WebSocketMessage;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class SocketSignalHandler extends TextWebSocketHandler {
	private RoomService roomService;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	public SocketSignalHandler(RoomService roomService) {
		logger.info("[ws] SocketSignalHandler creating...");
		this.roomService = roomService;
	}

	List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

	private Map<String, Room> roomSession = new HashMap<>();

	@Override 
	public void afterConnectionEstablished(WebSocketSession session) {
		logger.info("[ws] Session connection established successfully");
		session.setTextMessageSizeLimit(1024 * 1024);
		session.setBinaryMessageSizeLimit(1024 * 1024);
		sessions.add(session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
		logger.info("[ws] Session has been closed with status {} and session: {}", status, session);
		roomService.removeClientFromRoom(session.getId());
		sessions.remove(session);
	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
		WebSocketMessage webSocketMessage = objectMapper.readValue(message.getPayload(), WebSocketMessage.class);
		String userName = webSocketMessage.getFrom();
		String roomId = webSocketMessage.getRoomId();
		Room room;

		logger.info("[ws] Reveiced Type: [{}]. User: [{}]. Uid: [{}]", webSocketMessage.getType(),
				webSocketMessage.getFrom(), session.getId());

		switch (webSocketMessage.getType()) {
		case Constants.CHAT:
			logger.info("[ws] Text message: {}", webSocketMessage.getRoomId());
			break;
		case Constants.OFFER:
		case Constants.ANSWER:
		case Constants.ICE_CANDIDATE:
			this.filterUsersToNotify(session.getId(), webSocketMessage);
			break;
		case Constants.REQUEST_FOR_OFFER:
			this.filterUsersToNotify(session.getId(), webSocketMessage);
			break;
			
		case Constants.FETCH_SESSION_ID:
			this.sendCurrentSessionId(session);
			break;
			
		case Constants.JOIN:
			logger.info("[ws] User: {} has joined Room: #{}", userName, webSocketMessage.getRoomId());
			room = roomService.findRoomByUid(roomId)
					.orElseThrow(() -> new IOException("Invalid room number received !!!"));
			ClientDetail clientDetail = new ClientDetail();
			clientDetail.setClientName(userName);
			clientDetail.setRoomId(webSocketMessage.getRoomId());
			clientDetail.setSession(session);

			roomService.addClient(room, session.getId(), clientDetail);
			// roomSession.put(session.getId(), room);
			this.filterUsersToNotify(session.getId(), webSocketMessage);
			break;
		case Constants.LEAVE:
			logger.info("[ws] {} is leaving Room: #{}", userName, webSocketMessage.getRoomId());
			roomService.removeClientFromRoom(session.getId());
			break;
		default:
			logger.debug("[ws] Type of the received message {} is undefined!", webSocketMessage.getType());
		}
	}

	private void filterUsersToNotify(String sessionId, WebSocketMessage webSocketMessage) {
		Room rm = roomService.findRoombySessionId(sessionId);
		if (rm != null) {
			Map<String, ClientDetail> clients = roomService.getClients(rm);
			for (Map.Entry<String, ClientDetail> client : clients.entrySet()) {
				ClientDetail clientWebSocketSession = client.getValue();
				if (clientWebSocketSession.getSession().getId() != sessionId) {
					sendMessage(clientWebSocketSession.getSession(),
							new WebSocketMessage(sessionId, webSocketMessage.getPeerUid(),
									webSocketMessage.getFrom(), webSocketMessage.getType(),
									webSocketMessage.getRoomId(), webSocketMessage.getCandidate(),
									webSocketMessage.getSdp()));
				}
			}
		}
	}
	
	private void sendCurrentSessionId(WebSocketSession webSocketSession) {
		sendMessage(webSocketSession,
					new WebSocketMessage(webSocketSession.getId(), 
							Constants.ALL,
							"", 
							Constants.FETCH_SESSION_ID,
							null, 
							null,
							null
						)
				);
	}

	private void sendMessage(WebSocketSession webSocketSession, WebSocketMessage message) {
		try {
			String stringifyMessage = objectMapper.writeValueAsString(message);
			if (webSocketSession.isOpen()) {
				synchronized (webSocketSession) {
					webSocketSession.sendMessage(new TextMessage(stringifyMessage));
				}
			} else {
				logger.info("[ws] Unexpectedly session closed");
			}
		} catch (IOException e) {
			// TODO: handle exception
			logger.debug("An error occured: {}", e.getMessage());
		}
	}
}