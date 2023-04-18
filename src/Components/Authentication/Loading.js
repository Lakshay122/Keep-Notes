import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Loading() {
    const queryParams = new URLSearchParams(window.location.search)
    let id = queryParams.get('id')
    console.log(id)
    const navigate = useNavigate();
    const getData = () => {
        axios.post("/verify_token", id)
            .then((resp) => {
                console.log(resp.data);
                if (resp.data.status == 'true') {
                    navigate('/reset')
                }
                else {
                    alert(resp.data.error)
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }
    useEffect(() => {
        getData();


    }, [])



    return (
        <div>
            Loading....
        </div>
    )
}
