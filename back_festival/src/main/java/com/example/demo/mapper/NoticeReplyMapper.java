package com.example.demo.mapper;

public interface NoticeReplyMapper {
	long getTotal(long noticenum);
	int getRecentNreplyCnt(long noticenum);

}
