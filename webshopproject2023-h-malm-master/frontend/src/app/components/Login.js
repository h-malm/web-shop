"use client";
import { useState, useEffect } from "react";
import { API_BASE } from "@/utils/api";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import styles from './../page.module.css';
import React from "react";

const LoginPage = () => {
    const [username, setUsername] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [isLoggedIn, setIsLoggedIn] = useState( false );
    const toast = useRef( null );

    const authenticate = async () => {
        try {
            const res = await fetch( `${API_BASE}/token/`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify( { username, password } ),
            } );

            if ( res.ok ) {
                const data = await res.json();
                localStorage.setItem( 'accessToken', data.access );
                localStorage.setItem( 'refreshToken', data.refresh );
                localStorage.setItem( 'username', username );
                setIsLoggedIn( true );
                toast.current.show( {
                    severity: 'info',
                    detail: `Logged in as '${username}'`
                } );
                setUsername( "" );
                setPassword( "" );
            } else {
                console.error( "Login failed" );
                toast.current.show( {
                    severity: 'error',
                    summary: 'Error', detail: 'Failed to login'
                } );
                setIsLoggedIn( false );
            }
        } catch ( error ) {
            console.error( "Error:", error );
            setIsLoggedIn( false );
        }
    };

    useEffect( () => {
        const accessToken = localStorage.getItem( 'accessToken' );
        const refreshToken = localStorage.getItem( 'refreshToken' );
        const isLoggedIn = localStorage.getItem( 'isLoggedIn' );

        if ( accessToken && refreshToken ) {
            setIsLoggedIn( true );
        } else {
            setIsLoggedIn( false );
        }
    }, [] );

    return (
        <>
            <div className={styles.loginContainer}>

                <div className={styles.subHeader}>
                    Sign in
                </div>
                <InputText
                    className={styles.styleInput}
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={( e ) => setUsername( e.target.value )}
                />
                <InputText
                    className={styles.styleInput}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={( e ) => setPassword( e.target.value )}
                />
                <Button
                    label="Sign in"
                    className="p-button"
                    onClick={authenticate} />
                <Toast ref={toast} />
            </ div>
        </>
    );
};

export default LoginPage;
