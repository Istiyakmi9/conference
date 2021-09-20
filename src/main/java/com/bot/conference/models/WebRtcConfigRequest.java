package com.bot.conference.models;

public class WebRtcConfigRequest {
	private String requestType;
	private String connectionToken;
	private boolean isConference;

	public String getRequestType() {
		return requestType;
	}

	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	public String getConnectionToken() {
		return connectionToken;
	}

	public void setConnectionToken(String connectionToken) {
		this.connectionToken = connectionToken;
	}

	public boolean isConference() {
		return isConference;
	}

	public void setConference(boolean isConference) {
		this.isConference = isConference;
	}
}
