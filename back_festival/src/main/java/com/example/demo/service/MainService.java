package com.example.demo.service;

import java.util.ArrayList;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BookmarkDTO;
import com.example.demo.domain.NoticeDTO;

public interface MainService {

	ArrayList<BoardDTO> getBestBoard(String lastMonth, String toDay);

	ArrayList<NoticeDTO> getNotice();

	ArrayList<BookmarkDTO> getBookmarkList(String loginUser);
	
}
