import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from "react-modal";

import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import Post from '../feed/post';
import ImgCancel from '../../images/cancel.png';
import { removeCookie } from '../../util/cookieUtil';

import ImgHome from '../../images/home.png';
import ImgBookmark from '../../images/bookmark.png';
import ImgSearch from '../../images/search.png';
import ImgMessage from '../../images/message.png';
import ImgPost from '../../images/post.png';
import ImgLogout from '../../images/logout.png';
import ImgReturn from '../../images/return.png';
import { getUserimgSrc } from '../../util/ImgSrcUtil';

function SideMenu({ setNewFeed, btnReturn }) {
    const loginUser = useSelector(state => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogout = () => {
        removeCookie('user');
        dispatch(logoutAction());
        navigate('/')
    }

    const toggleModal = () => {
        document.body.style.overflow = isOpen ? "auto" : "hidden";
        setIsOpen(!isOpen);
    }

    return (
        <>
            <nav className="side_menu">
                {
                    btnReturn ? (
                        <div className="row">
                            <Link to="/" className="link">
                                <img src={ImgReturn} className="icon" /><span className="name">Return</span>
                            </Link>
                        </div>
                    ) : null
                }
                <div className="row">
                    <Link to="/" className="link">
                        <img src={ImgHome} className="icon" /><span className="name">Home</span>
                    </Link>
                </div>
                <div className="row">
                    <Link to={`/member/${loginUser.nickname}`} className="link">
                        <img src={getUserimgSrc(loginUser)} className="icon" /><span className="name">My page</span>
                    </Link>
                </div>
                <div className="row" >
                    <Link to="/search" className="link">
                        <img src={ImgSearch} className="icon" /><span className="name">Search</span>
                    </Link>
                </div>
                <div className="row" >
                    <Link to="/bookmarks" className="link">
                        <img src={ImgBookmark} className="icon" /><span className="name">Bookmarks</span>
                    </Link>
                </div>
                <div className="row">
                    <Link to="/message" className="link">
                        <img src={ImgMessage} className="icon" /><span className="name">Message</span>
                    </Link>
                </div>
                <div className="row">
                    <button className="link" onClick={() => {
                        toggleModal();
                    }}>
                        <img src={ImgPost} className="icon" /><span className="name">Post</span>
                    </button>
                </div>
                <div className="row btn_logout">
                    <button className="link" onClick={() => { onLogout() }}>
                        <img src={ImgLogout} className="icon" /><span className="name">Logout</span>
                    </button>
                </div>
            </nav>
            <Modal className="modal" overlayClassName="orverlay_modal" isOpen={isOpen} ariaHideApp={false} >
                <img src={ImgCancel} className="icon close link" onClick={() => {
                    toggleModal();
                }} />
                <Post setIsOpen={setIsOpen} setNewFeed={setNewFeed} />
            </Modal>
        </>
    )
}

export default SideMenu