package com.example.demo.mapper;


import org.apache.ibatis.annotations.Mapper;

import java.util.List;


import com.example.demo.domain.NoticeFileDTO;

@Mapper
public interface NoticeFileMapper {
	int insertFile(NoticeFileDTO nfdto);
	List<NoticeFileDTO> getFiles(long noticenum);
	int deleteFileBySystemname(String systemname);
	NoticeFileDTO getFileBySystemname(String systemname);
	int deleteFilesByNoticenum(long noticenum);

}
