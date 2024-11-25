package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.UserInfoDTO;

@Mapper
public interface UserInfoMapper {
	int insertUserInfo(UserInfoDTO userInfo);
	int updateUserInfo(UserInfoDTO userInfo);
	int deleteUserInfo(String userid);
	UserInfoDTO getUserInfoByUserid(String userid);
}








