package com.example.demo.domain;

import lombok.Data;

@Data
public class NoteDTO {
	private long notenum;
	private String senduser;
	private String receiveuser;
	private String title;
	private String content;
	private String regdate;
	private long readcnt;
}
