package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserFileMapper {

	boolean firstInsert(String userid);
	int updateFile(String userid, String systemname);
	int defaultFile(String userid);
	String getFile(String userid);
	void deleteFileBySystemname(String systemname);


}
