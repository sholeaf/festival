package com.example.demo.service;

import com.example.demo.domain.UserDTO;

public interface UserService {

	boolean join(UserDTO user);
	boolean login(String userid, String userpw);
	boolean checkId(String userid);
	boolean leaveId(String userid);
	String checkEmail(String userid);
	UserDTO getUser(String userid);

}
