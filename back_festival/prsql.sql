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
DESCRIBE user;
ALTER TABLE user MODIFY COLUMN usergender CHAR(10);

create table bookmark(
	bmnum bigint primary key auto_increment,
	userid varchar(50),
    contentid varchar(50)
);

create table user_photo(
	userid varchar(50),
    systemname varchar(300)
);

insert into user_photo values( "apple", "기본프로필.png" );
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
    tag varchar(300)
);

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
    noticeregdate datetime default now()
);

create table notice_file(
	noticenum bigint,
    orgname varchar(300),
    systemname varchar(300)
);




######### ???? ###########
create table note(
	notenum bigint primary key auto_increment,
    senduser varchar(50),
    receiveuser varchar(50),
    title varchar(300),
    content varchar(1000),
    regdate datetime default now(),
    readcnt bigint
);