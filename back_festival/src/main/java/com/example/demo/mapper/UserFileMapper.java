package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserFileMapper {

	boolean firstInset(String userid);

	String getFile(String userid);

}
