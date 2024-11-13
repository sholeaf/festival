package com.example.demo.mapper;

import java.util.List;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeReplyDTO;


import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeReplyMapper {
	int insertNoticeReply(NoticeReplyDTO reply);
	NoticeReplyDTO getLastReply(String userid);
	long getTotal(long noticenum);
	List<NoticeReplyDTO> getList(Criteria cri, long noticenum);
	int getRecentNreplyCnt(long noticenum);
	NoticeReplyDTO getDetail(long replynum);
	int updateNoticeReply(NoticeReplyDTO reply);
	long deleteRepliesByNoticenum(long noticenum);
	int deleteNoticeReply(long replynum);
	int isNoticeExists(long noticenum);

}
