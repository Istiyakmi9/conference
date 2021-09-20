package com.bot.conference.models;

public class WebRtcConfigResponse {
	private String requestType;
	private String connectionToken;
	private boolean isConference;
	private String message;

	@Override
	public String toString() {
		return "WebRtcConfigResponse [requestType=" + requestType + ", connectionToken=" + connectionToken
				+ ", isConference=" + isConference + ", message=" + message + "]";
	}

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

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
