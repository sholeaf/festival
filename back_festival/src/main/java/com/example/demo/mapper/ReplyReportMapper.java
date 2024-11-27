package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;

@Mapper
public interface ReplyReportMapper {
	
	List<ReplyDTO> getReplyList(Criteria cri);
	int deleteReply(long replynum);
	int ReplyReportReset(long replynum);
	long getReplyReportTotal(Criteria cri);

}
