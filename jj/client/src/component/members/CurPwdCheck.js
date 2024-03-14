import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import Header from '../common/header';
import Sub from '../common/sub';
import { useSelector } from 'react-redux';
import axios from 'axios';

function CurPwdCheck() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [curpwd, setCurPwd] = useState('');
    useEffect(() => {
        if (!loginUser) {
            alert('로그인이 필요합니다');
            navigate('/');
        }

    }, [])


    const onSubmit = () => {
        if (curpwd === '') {
            return alert('비밀번호를 입력해주세요')
        } else {
            axios.post('/api/members/passwordCheck', null, { params: { curpwd, nickname: loginUser.nickname } })
                .then((result) => {
                    console.log(result.data);
                    if (result.data.message !== 'OK') {
                        setCurPwd("");
                        return alert(result.data.message, '비밀번호가 다릅니다');
                    } else {
                        navigate('/EditPassword')
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }
    return (
        <div className="wrap_main">
            <header><Header /></header>
            <main>
                <div className='updateform'>
                    <div className='wrap_update'>
                        <div className='editprofile'>
                            <div className="logo">EDIT PROFILE</div>
                            <div className='field'>
                                <input type="password" value={curpwd} onChange={
                                    (e) => { setCurPwd(e.currentTarget.value) }
                                } placeholder='Current Password' />
                            </div>
                            <div className='forgotPwd'><label onClick={() => {
                                navigate('/EmailCheck')
                            }}>Forgot Password?</label></div>
                            <div className='btns'>
                                <div className='updatebutton'>
                                    <button onClick={
                                        () => {
                                            onSubmit();
                                        }
                                    }>Submit</button>
                                    <button onClick={
                                        () => { navigate(`/member/${loginUser.nickname}`) }
                                    }>BACK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <aside id="aside"><Sub /></aside>
        </div>
    )
}

export default CurPwdCheck