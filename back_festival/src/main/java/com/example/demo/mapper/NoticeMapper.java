package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;



@Mapper
public interface NoticeMapper {
	List<NoticeDTO> getList(Criteria cri);
	long getTotal(Criteria cri);
	int insertNotice(NoticeDTO notice);
	long getLastNum(String userid);
	NoticeDTO getNoticeByNoticenum(long noticenum);
	void updateReadCount(long noticenum, int readcount);
	int updateNotice(NoticeDTO notice);
	int deleteNotice(long noticenum);
	
}
