package com.example.demo.domain;

import lombok.Data;

@Data
public class ReplyCriteria {
    private int pagenum;
    private int amount;
    private String replyType; // 댓글 검색용 type (T: 내용, W: 작성자 등)
    private String replyKeyword; // 댓글 검색용 keyword
    private int startrow;
    private boolean existsCondition;

    public ReplyCriteria() {
        this(1, 10); // 기본값으로 pagenum=1, amount=10
    }

    public ReplyCriteria(int pagenum, int amount) {
        this.pagenum = pagenum;
        this.amount = amount;
        this.startrow = (this.pagenum - 1) * this.amount;
    }

    public void setPagenum(int pagenum) {
        this.pagenum = pagenum;
        this.startrow = (this.pagenum - 1) * this.amount;
    }

    public String[] getReplyTypeArr() {
        return replyType == null ? new String[] {} : replyType.split("");
    }
}
