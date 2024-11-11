package com.example.demo.domain;

import lombok.Data;

@Data
public class NoticeDTO {
	private long noticenum;
	private String noticetitle;
	private String noticecontent;
	private String userid;
	private String noticeregdate;
	private boolean isNew;
	private long nreplyCnt;
	private String updatenoticedate;
	private int noticereadcount;
	private int Readcount;
}
