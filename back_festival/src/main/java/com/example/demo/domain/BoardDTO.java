package com.example.demo.domain;

import lombok.Data;

@Data
public class BoardDTO {
	private long boardnum;
	private String boardtitle;
	private String boardcontent;
	private String userid;
	private String boardregdate;
	private long boardreadcnt;
	private long reportcnt;
	private String tag;
	
}
