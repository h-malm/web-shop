"use client";
import { useState, useEffect, useRef } from "react";
import { API_BASE } from "@/utils/api";
import { Button } from "primereact/button";
import Card from "./../start/components/Card";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import NavigationBar from "../start/components/NavigationBar";
import styles from './../page.module.css';
import 'primeicons/primeicons.css';

const MyItemsPage = () => {
    const [ username, setUsername ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const [ userAToken, setUserAToken ] = useState( "" );
    const [ userRToken, setUserRToken ] = useState( "" );
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const [ itemList, setItemList ] = useState( [] );
    const [ selectedItem, setSelectedItem ] = useState( null );
    const [ dialogVisible, setDialogVisible ] = useState( false );
    const [ itemsViewed, setItemsViewed ] = useState( false );
    const [ confirmDeleteVisible, setConfirmDeleteVisible ] = useState( false );
    const [ itemToDelete, setItemToDelete ] = useState( null );
    const [ editMode, setEditMode ] = useState( true );
    const [ newItem, setNewItem ] = useState( {
        color: "",
        title: "",
        description: "",
        price: "",
        owner: "",
        dateAdded: ""
    } );

    const toast = useRef( null );

    useEffect( () => {
        const accessToken = localStorage.getItem( 'accessToken' );
        const refreshToken = localStorage.getItem( 'refreshToken' );
        const savedUsername = localStorage.getItem( 'username' );

        // Set login state based solely on token presence
        if ( accessToken && refreshToken ) {
            setUserAToken( accessToken );
            setUserRToken( refreshToken );
            setIsLoggedIn( true );
            setUsername( savedUsername || "" );
        } else {
            setIsLoggedIn( false );
        }
    }, [] );

    const authenticate = async () => {
        try {
            const res = await fetch( `${ API_BASE }/token/`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify( { username, password } ),
            } );
            if ( res.ok ) {
                const data = await res.json();
                setUserAToken( data.access );
                setUserRToken( data.refresh );
                localStorage.setItem( 'accessToken', data.access );
                localStorage.setItem( 'refreshToken', data.refresh );
                localStorage.setItem( 'username', username );
                setIsLoggedIn( true );
            } else {
                toast.current.show( { severity: 'error', summary: 'Error', detail: 'Failed to login' } );
                setIsLoggedIn( false );
            }
        } catch ( error ) {
            console.error( "Error:", error );
            setIsLoggedIn( false );
        }
    };

    const getAuthUserItems = async () => {
        try {
            const response = await fetchWithRefreshToken( 'http://127.0.0.1:8000/api/auth-cards/', { method: "GET" } );
            if ( response.ok ) {
                const result = await response.json();
                const iList = result.map( ( item, key ) => (
                    <Card
                        cColor={ item.color }
                        cPrice={ item.price }
                        cTitle={ item.title }
                        cDescription={ item.description }
                        cDateAdded={ item.dateAdded }
                        cOwner={ item.owner }
                        key={ key }
                        editHandler={ () => editItem( item ) }
                        deleteHandler={ () => confirmDelete( item ) }
                        isEditable={ isLoggedIn }
                        isDeletable={ isLoggedIn }
                    />
                ) );
                setItemList( iList );
                setItemsViewed( true );
            } else {
                console.error( "Failed to fetch items" );
            }
        } catch ( error ) {
            console.error( "Error fetching items:", error );
        }
    };

    const handleLogout = () => {
        setUserAToken( "" );
        setUserRToken( "" );
        setItemList( [] );
        setIsLoggedIn( false );
        setItemsViewed( false );
        localStorage.removeItem( 'accessToken' );
        localStorage.removeItem( 'refreshToken' );
        localStorage.removeItem( 'username' );
    };

    const refreshToken = async () => {
        try {
            const res = await fetch( `${ API_BASE }/token/refresh/`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify( { refresh: userRToken } ),
            } );
            if ( res.ok ) {
                const data = await res.json();
                setUserAToken( data.access );
                localStorage.setItem( 'accessToken', data.access );
                return true;
            } else {
                handleLogout();
                return false;
            }
        } catch ( error ) {
            console.error( "Error refreshing token:", error );
            handleLogout();
            return false;
        }
    };

    const fetchWithRefreshToken = async ( url, options = {} ) => {
        try {
            let response = await fetch( url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${ userAToken }`,
                },
            } );
            if ( response.status === 401 ) {
                console.log( 'Token expired, refreshing...' );
                const success = await refreshToken();
                if ( success ) {
                    const newToken = localStorage.getItem( 'accessToken' );

                    response = await fetch( url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            "Authorization": `Bearer ${ newToken }`,
                        },
                    } );
                } else {
                    handleLogout();
                }
            }
            return response;
        } catch ( error ) {
            console.error( "Error fetching data:", error );
            throw error;
        }
    };

    const addItem = () => {
        setEditMode( false );
        setDialogVisible( true );
    };

    const handleAddItem = async () => {
        setEditMode( false );
        setDialogVisible( true );
        const currentDateAdded = new Date().toLocaleDateString( 'en-CA' );
        const presetCardOwner = { ...newItem, owner: username, dateAdded: currentDateAdded };
        if ( !validateItemContent( newItem ) ) return;
        try {
            const response = await fetchWithRefreshToken( `${ API_BASE }/auth-cards/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( presetCardOwner ),
            } );
            if ( response.ok ) {
                toast.current.show( { severity: 'success', summary: 'Success', detail: `Item '${ newItem.title }' added` } );
                await getAuthUserItems();
            } else {
                toast.current.show( { severity: 'error', summary: 'Error', detail: 'Failed to add item' } );
            }
        } catch ( error ) {
            console.error( "Error adding item:", error );
        }
        setDialogVisible( false );
        setNewItem( { color: "", title: "", description: "", price: "", owner: "", dateAdded: "" } );
    };

    const editItem = ( item ) => {
        setEditMode( true );
        setSelectedItem( item );
        setDialogVisible( true );
    };

    const handleItemUpdate = async () => {
        if ( !selectedItem || !validateItemContent( selectedItem ) ) return;
        try {
            const response = await fetchWithRefreshToken( `http://127.0.0.1:8000/api/auth-cards/${ selectedItem.id }/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( selectedItem ),
            } );
            if ( response.ok ) {
                toast.current.show( { severity: 'success', summary: 'Success', detail: `'${ selectedItem.title }' updated` } );
                await getAuthUserItems();
            } else {
                toast.current.show( { severity: 'error', summary: 'Error', detail: 'Failed to update item' } );
            }
        } catch ( error ) {
            console.error( "Error updating item:", error );
        }
        setDialogVisible( false );
    };

    const confirmDelete = ( item ) => {
        setItemToDelete( item );
        setConfirmDeleteVisible( true );
    };

    const handleDeleteItem = async () => {
        if ( itemToDelete.id === null ) return;
        const cardName = itemToDelete.title;
        try {
            const response = await fetchWithRefreshToken( `http://127.0.0.1:8000/api/auth-cards/${ itemToDelete.id }/`, {
                method: "DELETE",
            } );
            if ( response.ok ) {
                toast.current.show( { severity: 'success', summary: 'Success', detail: `'${ cardName }' deleted` } );
                await getAuthUserItems();
            } else {
                toast.current.show( { severity: 'error', summary: 'Error', detail: 'Failed to delete item' } );
            }
        } catch ( error ) {
            console.error( "Error deleting item:", error );
        }
        setConfirmDeleteVisible( false );
        setItemToDelete( null );
    };

    const validateItemContent = ( item ) => {
        if ( !item.color || !item.title || !item.description || !item.price ) {
            toast.current.show( { severity: 'error', summary: 'Error', detail: 'Please fill in all fields' } );
            return false;
        }
        return true;
    };

    return (
        <div className={ styles.outerDivStyle }>
            <NavigationBar />
            { isLoggedIn ? (
                <div>
                    <div>
                        <div className={ styles.subSubHeader }>
                            Signed in as &rdquo;{ username }&rdquo;
                        </div>
                    </div>
                    <div>
                        <Button
                            className="p-button add-button"
                            onClick={ addItem }
                            icon="pi pi-plus"
                            label="Add New Item for Sale"
                        />
                    </div>
                    <div style={ { display: 'flex', flexWrap: 'wrap', gap: '1rem' } }>
                        { itemList }
                    </div>
                    <br />
                    { !itemsViewed && (
                        <Button
                            onClick={ getAuthUserItems }
                            className="p-button"
                            label="View My Items"
                        />
                    ) }
                </div>
            ) : (
                <div>
                    <div className={ styles.subHeader }>
                        Sign in to see your items
                    </div>
                    <div className={ styles.login }>
                        <div>
                            <InputText
                                className={ styles.styleInput }
                                placeholder="Username"
                                type="text"
                                name="username"
                                value={ username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                            />
                        </div>
                        <div>
                            <InputText
                                className={ styles.styleInput }
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={ password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                            />
                        </div>
                        <Button
                            label="Sign in"
                            className="p-button"
                            onClick={ authenticate } />
                    </div>
                </div>
            ) }
            <Dialog
                className="p-dialog"
                visible={ dialogVisible }
                onHide={ () => setDialogVisible( false ) }
            >
                { editMode ? (
                    <div>
                        <div className={ styles.subHeader }>
                            Edit Item
                        </div>
                        <div>
                            <label>Title</label>
                            <InputText
                                value={ selectedItem?.title }
                                onChange={ ( e ) => setSelectedItem( { ...selectedItem, title: e.target.value } ) }
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <InputText
                                value={ selectedItem?.description }
                                onChange={ ( e ) => setSelectedItem( { ...selectedItem, description: e.target.value } ) }
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <InputText
                                value={ selectedItem?.price }
                                onChange={ ( e ) => setSelectedItem( { ...selectedItem, price: e.target.value } ) }
                            />
                        </div>
                        <Button
                            label="Cancel"
                            onClick={ () => setDialogVisible( false ) }
                            className="p-button cancelButton"
                        />
                        <Button
                            label="Save"
                            onClick={ handleItemUpdate }
                            className="p-button saveButton"
                        />
                    </div>
                ) : (
                    <div>
                        <div>
                            <div className={ styles.subHeader }>
                                Add Item
                            </div>
                            <div>
                                <small>Please, fill in all fields.</small>
                            </div>
                        </div>
                        <div>
                            <label>Title</label>
                            <InputText
                                value={ newItem.title }
                                className={ styles.styleInput }
                                placeholder="Title"
                                onChange={ ( e ) => { setNewItem( { ...newItem, title: e.target.value } ); } }
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <InputText
                                value={ newItem.description }
                                className={ styles.styleInput }
                                placeholder="Description"
                                onChange={ ( e ) => { setNewItem( { ...newItem, description: e.target.value } ); } }
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <InputText
                                value={ newItem.price }
                                className={ styles.styleInput }
                                placeholder="Price, e.g. 19.99"
                                onChange={ ( e ) => { setNewItem( { ...newItem, price: e.target.value } ); } }
                            />
                        </div>
                        <div>
                            <label>Color</label>
                            <InputText
                                value={ newItem.color }
                                className={ styles.styleInput }
                                placeholder="Color, e.g. red, blue or violet"
                                onChange={ ( e ) => { setNewItem( { ...newItem, color: e.target.value } ); } }
                            />
                        </div>
                        <div className={ styles.spaceForTooltip }>
                            <Button
                                label="Cancel"
                                className="p-button cancelButton"
                                onClick={ () => setDialogVisible( false ) }
                            />
                            <Button
                                label="Add Item"
                                icon="pi pi-plus"
                                className="p-button saveButton"
                                onClick={ handleAddItem }
                            />
                        </div>
                    </div>
                ) }
            </Dialog>
            <Dialog
                visible={ confirmDeleteVisible }
                onHide={ () => setConfirmDeleteVisible( false ) }
            >
                <div className={ styles.subHeader }>
                    Confirm Deletion
                </div>
                <p>This will permanently delete the item. Proceed?</p>
                <Button
                    label="No"
                    onClick={ () => setConfirmDeleteVisible( false ) }
                    className="p-button cancelButton"
                />
                <Button
                    label="Yes"
                    className="p-button saveButton"
                    onClick={ handleDeleteItem }
                />
            </Dialog>
            <Toast ref={ toast } />
        </div>
    );
};
export default MyItemsPage;
