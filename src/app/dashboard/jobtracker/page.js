
'use client'

import { useEffect, useState } from "react"

const JobTracker=()=>{
    const [user,setUser]=useState()
    useEffect(()=>{
        const storeduser = localStorage.getItem("user")
        if(!storeduser){
            window.location.href="/login"
        }
    },[])
    return(<></>)

}

export default JobTracker