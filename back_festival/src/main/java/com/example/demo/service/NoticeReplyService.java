package com.example.demo.service;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeReplyDTO;
import com.example.demo.domain.NoticeReplyPageDTO;

public interface NoticeReplyService {

	public NoticeReplyDTO regist(NoticeReplyDTO reply);
	public NoticeReplyPageDTO getList(Criteria cri, long noticenum);
	public boolean remove(long replynum);
	public boolean modify(NoticeReplyDTO reply);

}
