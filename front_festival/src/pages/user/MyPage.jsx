import Header from "../../layout/Header";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPage = () => {
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태
    const navigate = useNavigate();

    // 페이지 로드 시 관리자 여부를 확인하는 API 호출
    useEffect(() => {
        axios.get('/api/notice/checkadmin')
            .then(response => {
                setIsAdmin(response.data.admin); 
            })
            .catch(error => {
                setIsAdmin(false);  
            });
    }, []);

    // 관리자일 경우 자동으로 AdminPage로 리디렉션
    useEffect(() => {
        if (isAdmin) {
            navigate('/notice/adminpage'); 
        }
    }, [isAdmin, navigate]);

    return (
        <>
        <Header/>
        <div>
            {!isAdmin && (
                <div>
                    <h1>MyPage</h1>
                    <p>마이페이지부분</p>
                </div>
            )}
        </div>
        </>
    );
};

export default MyPage;
