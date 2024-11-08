package com.example.demo.mapper;

import java.util.List;

import com.example.demo.domain.NoticeFileDTO;

public interface NoticeFileMapper {
	void insertFile(NoticeFileDTO nfdto);
	List<NoticeFileDTO> getFiles(long noticenum);

}
