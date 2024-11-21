package com.example.demo.mapper;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookmarkMapper {

	ArrayList<String> getBookmark(String userid);

	boolean addBookmark(String userid, String contentid);

	boolean removeBookmark(String userid, String contentid);
}
