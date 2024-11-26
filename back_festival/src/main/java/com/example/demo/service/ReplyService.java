package com.example.demo.service;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyPageDTO;

public interface ReplyService {
	ReplyDTO regist(ReplyDTO reply);
	ReplyPageDTO getList(Criteria cri, long boardnum);
	boolean removeReply(long replynum);
	ReplyDTO updateReply(ReplyDTO reply);
	ReplyDTO getReplyByNum(long replynum);
}