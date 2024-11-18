package com.example.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private String userid;
	private String userpw;
	private String username;
	private String userphone;
	private String useremail;
	private String usergender;
	private String zipcode;
	private String addr;
	private String addrdetail;
	private String addretc;
}
