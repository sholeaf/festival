package com.example.demo.domain;

import lombok.Data;

@Data
public class Criteria {
	private int pagenum;
	private int amount;
	private String type;
	private String keyword;
	private int startrow;
	
	public Criteria() {
		this(1,10);
	}
	
	public Criteria(int pagenum, int amount) {
		this.pagenum = pagenum;
		this.amount = amount;
		this.startrow = (this.pagenum - 1) * this.amount;
	}
	public void setPagenum(int pagenum) {
		this.pagenum = pagenum;
		this.startrow = (this.pagenum - 1) * this.amount;
	}
	public String[] getTypeArr() {
		return type == null ? new String[] {} : type.split("");
	}
}

