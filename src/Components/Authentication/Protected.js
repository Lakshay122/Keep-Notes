import React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function Protected(props) {
  const { Component } = props
  const navigate = useNavigate();
  let value = localStorage.getItem("token");
  if(!value){
    value = sessionStorage.getItem("token")
  }
  let remeber = localStorage.getItem("remember");
  if(!remeber){
    remeber = sessionStorage.getItem("remember")
  }
  
  useEffect(() => {
    if (!value) {
      navigate('/Sign')
    }
    if (value && (remeber === true)) {
      navigate('/')

    }
    if (value && remeber === false) {

      navigate('/')
      const clearStorage = () => {
        let session = sessionStorage.getItem('token');

        if (session == null) {

          localStorage.clear();

        }
        sessionStorage.setItem('token', 1);
      }
      window.addEventListener('load', clearStorage);
    }
    else if (!value && !remeber) {
      navigate('Sign')
    }

  }, []);


  return (
    <div>
      <Component />
    </div>
  )
}
