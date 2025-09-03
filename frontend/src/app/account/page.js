"use client";
import { useEffect, useState, useRef } from 'react';
import { API_BASE } from "@/utils/api";
import { csrftoken } from "@/utils/csrfCookie";
import NavigationBar from "@/app/start/components/NavigationBar";
import styles from './../page.module.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AccountPage = () => {
    const [ oldPassword, setOldPassword ] = useState( "" );
    const [ newPassword, setNewPassword ] = useState( "" );
    const [ isLoggedIn, setIsLoggedIn ] = useState( true );
    const toast = useRef( null );

    useEffect( () => {
        const accessToken = localStorage.getItem( 'accessToken' );
        const refreshToken = localStorage.getItem( 'refreshToken' );
        if ( accessToken && refreshToken ) {
            setIsLoggedIn( true );
        } else {
            setIsLoggedIn( false );
        }
    }, [] );

    const handleChangePassword = async ( e ) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem( 'accessToken' );
            const res = await fetch( `${ API_BASE }/change-password/`, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${ token }`,
                    "X-CSRFToken": csrftoken(),
                },
                method: "POST",
                body: JSON.stringify( {
                    old_password: oldPassword,
                    new_password: newPassword,
                } ),
            } );
            const text = await res.text();
            if ( !res.ok ) {
                const errorData = JSON.parse( text );
                throw new Error( errorData.old_password ? errorData.old_password[ 0 ] : 'An error occurred' );
            }
            toast.current.show( { severity: 'success', summary: 'Success', detail: 'Password changed successfully' } );
        } catch ( error ) {
            toast.current.show( { severity: 'error', summary: 'Error', detail: 'Failed to change password' } );
        }
    };

    return (
        <div className={ styles.outerDivStyle }>
            <NavigationBar></NavigationBar>
            <div className={ styles.subSubHeader }>
                Account details
            </div>

            { isLoggedIn ? (
                <div className={ styles.login }>
                    <form onSubmit={ handleChangePassword }>
                        <div>
                            <InputText
                                className={ styles.styleInput }
                                placeholder='Old Password'
                                type="password"
                                value={ oldPassword }
                                onChange={ ( e ) => setOldPassword( e.target.value ) }
                                required
                            />
                        </div>
                        <div>
                            <InputText
                                className={ styles.styleInput }
                                placeholder='New Password'
                                type="password"
                                value={ newPassword }
                                onChange={ ( e ) => setNewPassword( e.target.value ) }
                                required
                            />
                        </div>
                        <Button
                            className="p-button"
                            label='Change Password'
                            type="submit"
                        />
                    </form>
                </div>
            ) : (
                <div>Not signed in</div>
            ) }
            <Toast ref={ toast } />
        </div>
    );
};
export default AccountPage;
