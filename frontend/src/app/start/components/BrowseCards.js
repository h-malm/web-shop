import { useEffect, useState, useCallback } from 'react';
import { API_BASE } from "@/utils/api";
import { Button } from 'primereact/button';
import Card from "./Card";
import Cart from "./Cart";
import { ConfirmPopup } from 'primereact/confirmpopup';
import { csrftoken } from "@/utils/csrfCookie";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import styles from './../../page.module.css'
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function BrowseCards() {
    const [ cart, setCart ] = useState( [] );
    const [ itemList, setCardList ] = useState( [] );
    const [ currentUser, setCurrentUser ] = useState( null );
    const [ msg, setMsg ] = useState();
    const [ isLoggedIn, setIsLoggedIn ] = useState( true );
    const [ userLoggedOut, setUserLoggedOut ] = useState( false );
    const [ searchQuery ] = useState( '' );
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ visible, setVisible ] = useState( false );
    const [ action, setAction ] = useState( '' );

    const buttonEl = useRef( null );
    const toast = useRef( null );

    const addItem = useCallback( async ( item ) => {
        if ( currentUser && item.owner === currentUser ) {
            toast.current.show( { severity: 'warn', detail: 'You cannot add your own items to the cart.' } );
            return;
        }

        if ( userLoggedOut ) {
            toast.current.show( { severity: 'warn', detail: 'You need to sign in to add items to the cart' } );
            return;
        }

        try {
            await fetch( `${ API_BASE }/cart/`, {
                method: "POST",
                body: JSON.stringify( {
                    color: item.color,
                    price: item.price,
                    title: item.title,
                    description: item.description,
                    dateAdded: item.dateAdded,
                    owner: item.owner
                } ),
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": csrftoken(),
                },
            } );
            toast.current.show( { severity: 'success', detail: `Added '${ item.title } ' to cart` } )
            await refreshCart();
        } catch ( error ) {
            console.error( 'Error adding item to cart:', error );
        }
    }, [ currentUser, userLoggedOut ] );

    const init = useCallback( async ( search = searchTerm ) => {
        try {
            const url = search ?
                `http://127.0.0.1:8000/api/cards/?search=${ search }`
                : `http://127.0.0.1:8000/cards/`;
            const itemRes = await fetch( url );
            const itemResult = await itemRes.json();
            const iListJSX = itemResult.map( ( item, key ) => (
                <Card
                    cColor={ item.color }
                    cPrice={ item.price }
                    cTitle={ item.title }
                    cDescription={ item.description }
                    cDateAdded={ item.dateAdded }
                    cOwner={ item.owner }
                    cStatus={ item.status }
                    key={ key }
                    clickHandler={ () => addItem( item ) }
                />
            ) );
            setCardList( iListJSX );
            const cartRes = await fetch( `${ API_BASE }/cart/`, {
                headers: { "Content-type": "application/json" },
            } );
            const cartData = await cartRes.json();
            setCart( cartData );
        } catch ( error ) {
            console.error( 'Error fetching data:', error );
        }
    }, [ addItem, searchTerm ] );

    const refreshCart = async () => {
        const cartRes = await fetch( `${ API_BASE }/cart/`, {
            headers: { "Content-type": "application/json" },
        } );
        const cartData = await cartRes.json();
        setCart( cartData );
    }

    useEffect( () => {
        if ( searchTerm ) {
            init( searchTerm );
        }
    }, [ init, searchTerm ] );

    useEffect( () => {
        if ( currentUser !== null ) {
            init( searchTerm );
        }
    }, [ init, currentUser, searchTerm ] );

    useEffect( () => {
        const fetchUserData = () => {
            const username = localStorage.getItem( 'username' );

            if ( username ) {
                setCurrentUser( username );
            }
        };
        fetchUserData();
        init( searchTerm );
    }, [ init, searchTerm ] );

    useEffect( () => {
        const accessToken = localStorage.getItem( 'accessToken' );
        const refreshToken = localStorage.getItem( 'refreshToken' );
        if ( accessToken && refreshToken ) {
            setIsLoggedIn( true );
            setUserLoggedOut( false );
        } else {
            setIsLoggedIn( false );
            setUserLoggedOut( true );
        }
    }, [] );

    const filteredItems = itemList.filter( ( item ) => {
        return item.props.cTitle.toLowerCase().includes( searchQuery.toLowerCase() );
    } );

    const removeItem = async ( id ) => {
        const cardToRemove = cart.find( item => item.id === id );
        try {
            await fetch( `${ API_BASE }/cart/${ id }/`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": csrftoken(),
                },
            } );
            toast.current.show( { severity: 'info', detail: `Removed '${ cardToRemove?.title }' item from cart` } )
            await init();
        } catch ( error ) {
            console.error( 'Error removing item from cart:', error );
        }
    };

    const clearCart = async () => {
        try {
            for ( const item of cart ) {
                await fetch( `${ API_BASE }/cart/${ item.id }/`, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": csrftoken(),
                    },
                } );
            }
        } catch ( error ) {
            console.error( 'Error clearing cart:', error );
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem( 'accessToken' );
            localStorage.removeItem( 'refreshToken' );
            localStorage.removeItem( 'loginTime' );
            localStorage.removeItem( 'username' );
            setUserLoggedOut( true );
            await clearCart();
            await init();
            setIsLoggedIn( false );
            setCurrentUser( null );
            toast.current.show( { severity: 'info', detail: 'Signed out successfully' } );
        } catch ( error ) {
            console.error( 'Error logging out' );
        }
    };

    const handlePopulateButton = () => {
        setAction( 'populate' );
        setVisible( true );
    };

    const handleLogoutClick = () => {
        setAction( 'logout' );
        setVisible( true );
    };

    const confirmAction = async () => {
        if ( action === 'populate' ) {
            const res = await fetch( `${ API_BASE }/populate/`, {
            } )
            const info = await res.json()
            setMsg( info.message );
            setTimeout( () => {
                setMsg( null );
            }, 5000 );
            handleLogout();
        } else if ( action === 'logout' ) {
            handleLogout();
        }
        setVisible( false );
    };

    return (
        <>
            <div>
                <Cart items={ cart } deleteHandler={ removeItem } />
                <div className={ styles.subHeader }>
                    Browse Cards
                </div>
                <div className={ styles.browseDiv } >
                    <div className={ styles.searchDiv }>
                        <form
                            onSubmit={ ( e ) => {
                                e.preventDefault();
                                const form = e.target;
                                // @ts-ignore
                                const formData = new FormData( form );
                                const formJson = Object.fromEntries( formData.entries() );
                                setSearchTerm( formJson.search.toString() );
                                init();
                            } }
                        >
                            <InputText
                                className="p-input"
                                placeholder="Search for titles"
                                type='text'
                                name='search'
                            />
                            <Button
                                className="p-button"
                                type='submit'
                                label='Search'
                            />
                        </form>
                    </div>
                    <div className={ styles.logoutAndPopulate }>
                        { isLoggedIn ? (
                            <div className={ styles.inlineBlock }>
                                <Button
                                    ref={ buttonEl }
                                    className="p-button"
                                    onClick={ handleLogoutClick }
                                    label='Logout'
                                />
                            </div>
                        ) : (
                            <></>
                        ) }
                        <div className={ styles.inlineBlock }>
                            <Button
                                ref={ buttonEl }
                                className="p-button"
                                onClick={ handlePopulateButton }
                                label='Repopulate Database'
                            />
                        </div>
                    </div>

                    <ConfirmPopup
                        target={ buttonEl.current }
                        visible={ visible }
                        onHide={ () => setVisible( false ) }
                        message={ action === 'populate'
                            ? isLoggedIn
                                ? "This action will clear the database, empty the cart, and log you out. Proceed?"
                                : "This action will clear the database and empty the cart. Proceed?"
                            : "Your cart will be emptied as you log out. Proceed?" }
                        accept={ confirmAction }
                    />
                    <div>{ msg } </div>
                    <div style={ { display: 'flex', flexWrap: 'wrap', gap: '1rem' } }>
                        { filteredItems }
                    </div>
                </div>
                <Toast ref={ toast } />
            </div >
        </>
    );
}
