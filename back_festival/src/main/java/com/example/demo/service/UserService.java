package com.example.demo.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.UserDTO;
import com.example.demo.domain.UserInfoDTO;

public interface UserService {

	boolean join(UserDTO user, UserInfoDTO userInfo);
	boolean login(String userid, String userpw);
	boolean checkId(String userid);
	boolean leaveId(String userid);
	HashMap<String, Object> getUser(String userid);
	UserDTO getUserid(String email);
	boolean modifyUser(UserDTO user);
	boolean modifyPw(String userid, String userpw);
	int profileModify(String userid, MultipartFile file, String deleteFile);
	int defaultProfile(String userid, String deleteFile);
	int deleteUser(String userid);
	HashMap<String, Object> getList(String userid);
	int updateInfo(UserInfoDTO userInfo);

}
