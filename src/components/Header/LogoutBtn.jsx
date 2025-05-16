import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'
import Service from '../../Appwrite/services'

const LogoutBtn = () => {

    const dispatch = useDispatch();

    const logoutHandler = ()=>{
        Service.logout().then(()=>
        {
            dispatch(logout());
        })
    }
  return (
    <button
    className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
