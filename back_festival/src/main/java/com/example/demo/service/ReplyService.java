package com.example.demo.service;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyPageDTO;

public interface ReplyService {
	public ReplyDTO regist(ReplyDTO reply);
	public ReplyPageDTO getList(Criteria cri, long boardnum);
}
