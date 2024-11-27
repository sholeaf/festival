package com.example.demo.mapper;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.BookmarkDTO;

@Mapper
public interface BookmarkMapper {

	ArrayList<String> getBookmark(String userid);

	boolean removeBookmark(String userid, String contentid);

	boolean addBookmark(BookmarkDTO bmDto);

	ArrayList<BookmarkDTO> getBookmarkList(String loginUser);

	void removeAllBookmark(String userid);
}
