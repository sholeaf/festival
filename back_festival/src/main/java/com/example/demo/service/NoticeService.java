package com.example.demo.service;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;

public interface NoticeService {
	HashMap<String, Object> getList(Criteria cri);
	long regist(NoticeDTO notice, MultipartFile[] files) throws Exception;
	HashMap<String, Object> getDetail(long noticenum, String loginUser);
	long nmodify(long noticenum, HttpStatus ok);
	int remove(long noticenum);

}
