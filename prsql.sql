create database project2;
use project2;
drop database project2;

############ USER ####################
create table user(
	userid varchar(50) primary key,
    userpw varchar(100),
    username varchar(100),
    userphone varchar(100),
    useremail varchar(50),
    usergender char(3),
    zipcode varchar(30),
    addr varchar(1000),
    addrdetail varchar(2000) not null,
    addretc varchar(300)
);
select * from user;
insert into user(userid, userpw, username,addrdetail) values ("admin","1234","관리자","korea");

create table bookmark(
	bmnum bigint primary key auto_increment,
	userid varchar(50),
    contentid varchar(50)
);

create table user_photo(
	userid varchar(50),
    systemname varchar(300)
);
insert into user_photo value("admin", "test.png");
select * from user_photo;
drop table user_photo;

################## BOARD #####################
create table board(
	boardnum bigint primary key auto_increment,
    boardtitle varchar(300),
    boardcontent varchar(1000),
    userid varchar(50),
    boardregdate datetime default now(),
    boardreadcnt bigint,
	reportcnt bigint,
    tag varchar(300),
    titleImage varchar(300),
    preview varchar(300)
);
select * from board where userid = "apple";
insert into board (boardtitle, boardcontent, userid, boardreadcnt, boardregdate, reportcnt) values ('신고테스트','테스트중입니다','apple','1',now(),'1');
insert into board (boardtitle, boardcontent, userid, boardreadcnt, boardregdate, reportcnt) values ('신고테스트','테스트중입니다','apple','1',now(),'6');
drop table board;
create table board_photo(
	boardnum bigint,
    systemname varchar(300)
);

create table reply(
	replynum bigint primary key auto_increment,
    replycontent varchar(300),
    userid varchar(50),
    boardnum bigint,
    replyregdate datetime default now()
);

create table board_like(
	boardnum bigint,
    userid varchar(50)
);
create table reply_report(
	boardnum bigint,
    userid varchar(50)
);
create table board_report(
	boardnum bigint,
    userid varchar(50)
);

############## notice ###################
create table notice(
	noticenum bigint primary key auto_increment,
    noticetitle varchar(300),
    noticecontent varchar(1000),
    userid varchar(50),
    noticeregdate datetime default now(),
    updatedate datetime default now(),
    readcount bigint
);
select * from notice;
insert into notice (noticetitle, noticecontent, userid) values ('공지사항테스트','공지에요오수정중이에요오','admin');
delete from notice where noticenum = 5;
drop table notice;

create table notice_file(
	noticenum bigint,
    orgname varchar(300),
    systemname varchar(300)
);
select * from notice_file;
drop table notice_file;
UPDATE notice_file
SET
    orgname = NULL
WHERE noticenum = 20;

create table notice_reply(
	replynum bigint primary key auto_increment,
    replycontent varchar(300),
    userid varchar(50),
    replyregdate datetime default now(),
    updatedate datetime default now(),
	noticenum bigint,
    foreign key (noticenum) references notice (noticenum)
	ON DELETE CASCADE
    ON UPDATE CASCADE
);
drop table notice_reply;


######### ???? ###########
create table note(
	notenum bigint primary key auto_increment,
    senduser varchar(50),
    receiveuser varchar(50),
    title varchar(300),
    content varchar(1000),
    regdate datetime default now()
);
select * from note;
drop table note;
insert into note (senduser, receiveuser, title, content, regdate) values ('apple','admin','쪽지테스트','제발~',now());
