package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeReplyDTO;
import com.example.demo.domain.NoticeReplyPageDTO;
import com.example.demo.mapper.NoticeReplyMapper;

@Service
public class NoticeReplyServiceImpl implements NoticeReplyService {
	@Autowired
	private NoticeReplyMapper nrmapper;
	
	@Override
	public NoticeReplyDTO regist(NoticeReplyDTO reply) {
		if(nrmapper.insertNoticeReply(reply)==1) {
			return nrmapper.getLastReply(reply.getUserid());
		}
		return null;
	}

	@Override
	public NoticeReplyPageDTO getList(Criteria cri, long boardnum) {
		long totalCnt = nrmapper.getTotal(boardnum);
		List<NoticeReplyDTO> list = nrmapper.getList(cri, boardnum);
		NoticeReplyPageDTO dto = new NoticeReplyPageDTO(totalCnt,list);
		return dto;
	}

	@Override
	public boolean remove(long replynum) {
		return nrmapper.deleteNoticeReply(replynum)==1;
	}

	@Override
	public boolean modify(NoticeReplyDTO reply) {
		NoticeReplyDTO rdto = nrmapper.getDetail(reply.getReplynum());
		if(rdto.getUserid().equals(reply.getUserid())) {
			return nrmapper.updateNoticeReply(reply)==1;
		}
		return false;
	}

}
