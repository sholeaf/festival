package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeReplyDTO;
import com.example.demo.domain.NoticeReplyPageDTO;
import com.example.demo.mapper.NoticeReplyMapper;

@Service
public class NoticeReplyServiceImpl implements NoticeReplyService {
	@Autowired
	private NoticeReplyMapper nrmapper;
	
	@Transactional
	@Override
	public NoticeReplyDTO regist(NoticeReplyDTO reply) {
		//reply.getNoticenum 번호 확인
		System.out.println("Received noticenum in regist method: " + reply.getNoticenum());
	    // 게시글이 존재하는지 확인
		 System.out.println("Checking if notice exists for noticenum: " + reply.getNoticenum());
	    if (nrmapper.isNoticeExists(reply.getNoticenum()) == 0) {
	        // 게시글이 존재하지 않으면 예외를 발생시키거나 처리
	        throw new RuntimeException("The notice does not exist.");
	    }

	    // 댓글 등록
	    if(nrmapper.insertNoticeReply(reply) == 1) {
	        return nrmapper.getLastReply(reply.getUserid());
	    }
	    return null;
	}

	@Override
	public NoticeReplyPageDTO getList(Criteria cri, long noticenum) {
	    // 댓글 총 개수 가져오기
	    long totalCnt = nrmapper.getTotal(noticenum);
	    System.out.println("NoticeReplyServiceTotal: " + totalCnt);  // 디버깅용 로그
	    
	    // 댓글 목록 가져오기
	    List<NoticeReplyDTO> list = nrmapper.getList(cri, noticenum);
	    System.out.println("List Size: " + (list != null ? list.size() : "null"));  // 디버깅용 로그
	    
	    // 댓글 목록이 비어 있거나 null일 경우
	    if (list == null) {
	        list = new ArrayList<>();  // 빈 리스트로 처리
	    }
	    
	    // 페이지 DTO 생성
	    NoticeReplyPageDTO dto = new NoticeReplyPageDTO(totalCnt, list);
	    System.out.println("Page DTO: " + dto);  // 디버깅용 로그
	    
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
