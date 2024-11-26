package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;

@Mapper
public interface ReplyMapper {
	int insertReply(ReplyDTO reply);
	ReplyDTO getLastReply(String userid);
	long getTotal(long boardnum);
	List<ReplyDTO> getList(Criteria cri, long boardnum);
	int removeReply(long replynum);
	int updateReply(ReplyDTO reply);
	void removeInBoard(long boardnum);
	ReplyDTO getReplyByNum(long replynum);
	void deleteAllReplyByBoardnum(long boardnum);
	long[] getReplynumByBoardnum(long boardnum);
	void deleteReportByReplynum(long replynum);
	void deleteReportByUserid(String userid);
}
