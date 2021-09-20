package com.bot.conference;


import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;

import com.bot.conference.models.ChatMessage;
import com.bot.conference.models.ChatRoom;
import com.bot.conference.models.Constants;
import com.bot.conference.models.WebRtcConfigRequest;
import com.bot.conference.models.WebRtcConfigResponse;

@RestController
public class WebRTCHandlingController {
	
	private SimpMessagingTemplate simpMessagingTemplate;
	
	public WebRTCHandlingController(SimpMessagingTemplate simpMessagingTemplate) {
		super();
		// TODO Auto-generated constructor stub
		this.simpMessagingTemplate = simpMessagingTemplate;
	}
	
	@Autowired
	ChatMessage chatMessage;	
	
	@Autowired
	ChatRoom chatRoom;
	

	@MessageMapping("/message")
	//@SendToUser("/queue/reply")
	public void processMessageFromClient(@Payload ChatMessage msg, 
			Principal principal, @Header("simpSessionId") String sessionId) throws Exception {
		try {
			System.out.println("Result generated: " + msg);
			System.out.println("Session Id: " + msg.getRecipientId());
			if(simpMessagingTemplate != null) {
				simpMessagingTemplate.convertAndSendToUser(msg.getRecipientId(), "/queue/room", msg);
			} else {
				System.out.println("SimpMessageSendingOperations: Object found null");
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@MessageMapping("/prerequestoffer")
	public void preRequestOffer(WebRtcConfigRequest webRtcConfigRequest, Principal principal, @Header("simpSessionId") String sessionId) {
		try {
			if(webRtcConfigRequest.getConnectionToken() != null && !webRtcConfigRequest.getConnectionToken().isEmpty()) {
				System.out.println("pre request offer requested by connectionId: " + webRtcConfigRequest.getConnectionToken());
				WebRtcConfigResponse webRtcConfigResponse = new WebRtcConfigResponse();
				
				if(webRtcConfigRequest.getRequestType() == Constants.VIDEO_CHAT) {
					webRtcConfigResponse.setRequestType(Constants.VIDEO_CHAT);
				} else {
					webRtcConfigResponse.setRequestType(Constants.CHAT);
				}
				
				if(webRtcConfigRequest.isConference()) {
					webRtcConfigResponse.setConference(true);				
				} else {
					webRtcConfigResponse.setConference(false);
				}
				
				webRtcConfigResponse.setConnectionToken(webRtcConfigRequest.getConnectionToken());
				System.out.println("Response: " + webRtcConfigResponse);
				this.simpMessagingTemplate.convertAndSendToUser(webRtcConfigRequest.getConnectionToken(), "queue/prerequestoffer", webRtcConfigResponse);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@MessageMapping("/prerequestoffer-answer")
	public void preRequestOfferAnswer(WebRtcConfigRequest webRtcConfigRequest, Principal principal, @Header("simpSessionId") String sessionId) {
		try {
			System.out.println("pre request offer answer requested by connectionId: " + webRtcConfigRequest.getConnectionToken());
			this.simpMessagingTemplate.convertAndSendToUser(sessionId, "queue/prerequestoffer", webRtcConfigRequest);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@MessageMapping("/webrtcsignaling")
	public void webRTCSignaling(WebRtcConfigRequest webRtcConfigRequest, Principal principal, @Header("simpSessionId") String sessionId) {
		try {
			System.out.println("pre request offer requested by connectionId: " + webRtcConfigRequest.getConnectionToken());
			this.simpMessagingTemplate.convertAndSendToUser(sessionId, "queue/prerequestoffer", webRtcConfigRequest);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@MessageExceptionHandler
	@SendToUser("/queue/error")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}
}
