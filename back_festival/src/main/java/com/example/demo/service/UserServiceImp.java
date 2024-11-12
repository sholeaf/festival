package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.UserDTO;
import com.example.demo.mapper.UserMapper;

@Service
public class UserServiceImp implements UserService{
	
	@Autowired
	private UserMapper umapper;

	@Override
	public boolean join(UserDTO user) {
		return umapper.insertUser(user) == 1;
	}

	@Override
	public boolean login(String userid, String userpw) {
		UserDTO user = umapper.getUserByUserid(userid);
		if(user != null) {
			if(user.getUserpw().equals(userpw)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean checkId(String userid) {
		UserDTO user = umapper.getUserByUserid(userid);
		return user == null;
	}

	@Override
	public boolean leaveId(String userid) {
		return umapper.deleteUser(userid) == 1;
	}

	@Override
	public String checkEmail(String userid) {
		String email = umapper.getEmailByUserid(userid);
		if(email != null) {
			return email;
		}
		return null;
	}

	@Override
	public UserDTO getUser(String userid) {
		return umapper.getUserByUserid(userid);
	}
}
