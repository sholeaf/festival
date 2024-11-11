package com.example.demo.mapper;

import java.util.List;

import com.example.demo.domain.NoticeFileDTO;

public interface NoticeFileMapper {
	int insertFile(NoticeFileDTO nfdto);
	List<NoticeFileDTO> getFiles(long noticenum);
	int deleteFileBySystemname(String systemname);
	NoticeFileDTO getFileBySystemname(String systemname);
	int deleteFilesByNoticenum(long noticenum);

}
