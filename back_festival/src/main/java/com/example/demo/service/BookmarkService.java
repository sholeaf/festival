package com.example.demo.service;

import java.util.ArrayList;

import com.example.demo.domain.BookmarkDTO;

public interface BookmarkService {
	ArrayList<String> getBookmark(String userid);
	boolean removeBookmark(String userid, String contentid);
	boolean addBookmark(BookmarkDTO bmDto);
}
