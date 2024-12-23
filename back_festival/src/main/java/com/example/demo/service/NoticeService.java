package com.example.demo.service;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface NoticeService {
	HashMap<String, Object> getList(Criteria cri);
	long regist(NoticeDTO notice, MultipartFile[] files) throws Exception;
	long remove(long noticenum);
	long nmodify(NoticeDTO notice, MultipartFile[] files, String[] deleteFiles) throws Exception;
	HashMap<String, Object> getDetail(long noticenum, String loginUser, HttpServletRequest req,
			HttpServletResponse resp);

}
