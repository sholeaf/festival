package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookmarkMapper {

	List<String> getBookmarkByUserid(String userid);

}
