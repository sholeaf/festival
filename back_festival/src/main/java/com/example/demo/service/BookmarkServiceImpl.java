package com.example.demo.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service
public class BookmarkServiceImpl implements BookmarkService {

	@Override
	public ArrayList<String> getBookmark(String userid) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public boolean addBookmark(String userid, String contentid) {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public boolean removeBookmark(String userid, String contentid) {
		// TODO Auto-generated method stub
		return false;
	}
}
