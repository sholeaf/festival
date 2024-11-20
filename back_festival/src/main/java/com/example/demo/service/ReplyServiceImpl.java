package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyPageDTO;
import com.example.demo.mapper.ReplyMapper;

@Service
public class ReplyServiceImpl implements ReplyService {
	
	@Autowired
	private ReplyMapper rmapper;
	
	@Override
	public ReplyDTO regist(ReplyDTO reply) {
		if(rmapper.insertReply(reply) == 1) {
			//검색 데이터 로직
			return rmapper.getLastReply(reply.getUserid());
		}
		return null;
	}

	@Override
	public ReplyPageDTO getList(Criteria cri, long boardnum) {
		long totalCnt = rmapper.getTotal(boardnum);
		List<ReplyDTO> list = rmapper.getList(cri,boardnum);
		
		ReplyPageDTO dto = new ReplyPageDTO(totalCnt, list);
		
		return dto;
	}

	@Override
	public boolean removeReply(long replynum) {
//		if(rmapper.removeReply(replynum) == 1) {
//			return true;
//		}
//		else return false;
		return (rmapper.removeReply(replynum) == 1)? true : false;
	}

	@Override
	public boolean updateReply(ReplyDTO reply) {
		return (rmapper.updateReply(reply) == 1)? true : false;
	}
}
