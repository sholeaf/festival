package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeReplyMapper {
	long getTotal(long noticenum);
	int getRecentNreplyCnt(long noticenum);

}
