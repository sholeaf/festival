package com.example.demo.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.BookmarkMapper;

@Service
public class BookmarkServiceImpl implements BookmarkService {

	@Autowired
	private BookmarkMapper bmmapper;
	
	@Override
	public ArrayList<String> getBookmark(String userid) {
		System.out.println("DD"+userid);
		System.out.println("dd" +bmmapper.getBookmark(userid));
		return bmmapper.getBookmark(userid);
	}
	@Override
	public boolean addBookmark(String userid, String contentid) {
		return bmmapper.addBookmark(userid,contentid);
	}

	@Override
	public boolean removeBookmark(String userid, String contentid) {
		return bmmapper.removeBookmark(userid,contentid);
	}
}
