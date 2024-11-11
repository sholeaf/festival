package com.example.demo.mapper;

import java.util.List;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;




public interface NoticeMapper {
	List<NoticeDTO> getList(Criteria cri);
	long getTotal(Criteria cri);
	int insertNotice(NoticeDTO notice);
	long getLastNum(String userid);
	NoticeDTO getNoticeByNoticenum(long noticenum);
	void updateReadCount(long noticenum, int redcount);
	int updateNotice(NoticeDTO notice);
	int deleteNotice(long noticenum);
	

}
