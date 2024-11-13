package com.example.demo.service;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.UserDTO;
import com.example.demo.mapper.UserFileMapper;
import com.example.demo.mapper.UserMapper;

@Service
public class UserServiceImp implements UserService{
	
	@Autowired
	private UserMapper umapper;
	
	@Autowired
	private UserFileMapper fmapper;

	@Override
	public boolean join(UserDTO user) {
		if(fmapper.firstInset(user.getUserid())) {
			return umapper.insertUser(user) == 1;			
		}
		return false;
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
	public HashMap<String, Object> getUser(String userid) {
		HashMap<String, Object> result = new HashMap<>();
		
		UserDTO user = umapper.getUserByUserid(userid);
		String file = fmapper.getFile(userid);
		
		result.put("user", user);
		result.put("file", file);
		
		return result;
	}

	@Override
	public UserDTO getUserid(String email) {
		return umapper.getUserByUseremail(email);
	}
}
