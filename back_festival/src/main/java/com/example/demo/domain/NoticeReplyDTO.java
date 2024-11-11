package com.example.demo.domain;

import lombok.Data;

@Data
public class NoticeReplyDTO {
	private long replynum;
	private String replycontent;
	private String userid;
	private long boardnum;
	private String replyregdate;
}
