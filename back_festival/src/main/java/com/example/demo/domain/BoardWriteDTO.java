package com.example.demo.domain;

import lombok.Data;

@Data
public class BoardWriteDTO {
	private BoardDTO board;
	private String[] removeImages;
}
