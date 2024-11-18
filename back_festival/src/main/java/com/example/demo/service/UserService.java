package com.example.demo.service;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.UserDTO;

public interface UserService {

	boolean join(UserDTO user);
	boolean login(String userid, String userpw);
	boolean checkId(String userid);
	boolean leaveId(String userid);
	HashMap<String, Object> getUser(String userid);
	UserDTO getUserid(String email);
	boolean modifyUser(UserDTO user);
	boolean modifyPw(String userid, String userpw);
	int profileModify(String userid, MultipartFile file, String deleteFile);
	int defaultProfile(String userid, String deleteFile);

}
