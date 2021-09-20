package com.bot.conference.models;

public class MessageDetail {

	private String UserName;
	private String MessageContent;

	public String getUserName() {
		return UserName;
	}

	public void setUserName(String userName) {
		UserName = userName;
	}

	public String getMessageContent() {
		return MessageContent;
	}

	public void setMessageContent(String messageContent) {
		MessageContent = messageContent;
	}

	@Override
	public String toString() {
		return "MessageDetail [UserName=" + UserName + ", MessageContent=" + MessageContent + "]";
	}
}
