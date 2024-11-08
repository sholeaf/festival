package com.example.demo.mapper;


import org.apache.ibatis.annotations.Mapper;

import java.util.List;


import com.example.demo.domain.NoticeFileDTO;

@Mapper
public interface NoticeFileMapper {
	void insertFile(NoticeFileDTO nfdto);
	List<NoticeFileDTO> getFiles(long noticenum);

}
