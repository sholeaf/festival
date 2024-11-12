package com.example.demo.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NoticeReplyPageDTO {
	private long replyCnt;
	private List<NoticeReplyDTO> list;
}
