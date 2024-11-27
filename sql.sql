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
	num bigint primary key auto_increment,
	userid varchar(50),
    contentid varchar(50),
    title varchar(500),
    image text
);

drop table bookmark;

insert into bookmark(userid,contentid) value("apple","3392074");


create table user_photo(
	userid varchar(50),
    systemname varchar(300)
);
insert into user_photo value("apple", "test.png");
select * from user_photo;
drop table user_photo;
delete from user_photo where userid = "apple";

create table user_info(
	userid varchar(50),
    nameinfo char(3),
    emailinfo char(3),
    genderinfo char(3)
); 
insert into user_info value("apple", "T", "T", "
T");
select * from user_info;
drop table user_info;

################## BOARD #####################
create table board(
	boardnum bigint primary key auto_increment,
    boardtitle varchar(300),
    boardcontent text,
    userid varchar(50),
    boardregdate datetime default now(),
    boardreadcnt bigint default 0,
    tag varchar(300),
    titleImage varchar(300)
);

delete from user where userid="apple";

SELECT 
    b.boardnum, 
    b.boardtitle, 
    b.boardcontent, 
    b.userid, 
    b.boardregdate, 
    b.boardreadcnt, 
    b.tag, 
    b.titleImage, 
    COUNT(bl.userid) AS like_count
FROM 
    board b
LEFT JOIN 
    board_like bl ON b.boardnum = bl.boardnum
GROUP BY 
    b.boardnum
ORDER BY 
    like_count DESC limit 4;

insert into board (boardtitle,boardcontent,userid,boardregdate) value('test','test','test','2024-10-21 11:50:57');
select * from board;
insert into board (boardtitle, boardcontent, userid, boardregdate, boardreadcnt) values ('신고테스트','테스트중입니다','apple',now(),'1');
insert into board (boardtitle, boardcontent, userid, boardregdate, boardreadcnt) values ('신고테스트','테스트중입니다','apple',now(),'6');
drop table board;

create table board_photo(
	boardnum bigint,
    systemname varchar(300)
);
select * from board_photo;

create table reply(
	replynum bigint primary key auto_increment,
    replycontent varchar(300),
    userid varchar(50),
    boardnum bigint,
    replyregdate datetime default now()
);


select * from reply where replynum = 1;
insert into board_like(boardnum,userid) value(1,'test');
create table board_like(
	boardnum bigint,
    userid varchar(50)
);

select * from board_like;

create table board_report(
	boardnum bigint,
    userid varchar(50)
);
select * from board_report;
drop table board_report;


create table reply_report(
    replynum bigint,
    userid varchar(50)
);

drop table reply_report;
insert into reply_report values(1, "1", 1);
insert into reply_report values(1, "1", 2);
insert into reply_report values(1, "2", 3);

select replynum from reply_report group by replynum having count(*)>4;

delete from reply_report where replynum = 1;

drop table reply_report;
select * from reply_report;


insert into board_report values(7, "banana");
insert into board_report values(8, "banana");
insert into board_report values(9, "banana");
select boardnum from board_report group by boardnum having count(*)>4;

SELECT * 
FROM board b
WHERE NOT EXISTS (
   SELECT 1 
   FROM board_report c
   WHERE b.boardnum = c.boardnum
   GROUP BY c.boardnum
   HAVING COUNT(*) > 4
) AND boardnum > 0 order by boardnum desc;

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
