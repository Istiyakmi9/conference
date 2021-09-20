package com.bot.conference.models;

import java.util.Objects;

public class WebSocketMessage {
	private String from;
	private String type;
	private String roomId;
	private Object candidate;
	private Object sdp;
	private String srcUid;
	private String peerUid;

	public WebSocketMessage() {
	}

	public WebSocketMessage(final String srcUid, final String peerUid, final String from, final String type,
			final String roomId, final Object candidate, final Object sdp) {
		this.srcUid = srcUid;
		this.peerUid = peerUid;
		this.from = from;
		this.type = type;
		this.roomId = roomId;
		this.candidate = candidate;
		this.sdp = sdp;
	}
	
	

	public String getSrcUid() {
		return srcUid;
	}

	public void setSrcUid(String srcUid) {
		this.srcUid = srcUid;
	}

	public String getFrom() {
		return from;
	}

	public void setFrom(final String from) {
		this.from = from;
	}

	public String getType() {
		return type;
	}

	public void setType(final String type) {
		this.type = type;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(final String roomId) {
		this.roomId = roomId;
	}

	public Object getCandidate() {
		return candidate;
	}

	public void setCandidate(final Object candidate) {
		this.candidate = candidate;
	}

	public Object getSdp() {
		return sdp;
	}

	public void setSdp(final Object sdp) {
		this.sdp = sdp;
	}

	public String getPeerUid() {
		return peerUid;
	}

	public void setPeerUid(String peerUid) {
		this.peerUid = peerUid;
	}

	@Override
	public String toString() {
		return "WebSocketMessage [from=" + from + ", type=" + type + ", roomId=" + roomId + ", candidate=" + candidate
				+ ", sdp=" + sdp + ", srcUid=" + srcUid + ", peerUid=" + peerUid + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(candidate, srcUid, roomId, from, peerUid, sdp, type);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		WebSocketMessage other = (WebSocketMessage) obj;
		return Objects.equals(candidate, other.candidate) && Objects.equals(srcUid, other.srcUid)
				&& Objects.equals(roomId, other.roomId) && Objects.equals(from, other.from)
				&& Objects.equals(peerUid, other.peerUid) && Objects.equals(sdp, other.sdp)
				&& Objects.equals(type, other.type);
	}
}
