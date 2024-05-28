import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions';
import requestApi from '../helpers/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState({})
    const [isSelectedFile, setIsSelectedFile] = useState(false)

    useEffect(() => {
        dispatch(actions.controllLoading(true))
        requestApi('/users/profile', 'GET').then(res => {
            setProfileData({ ...res.data, avatar: process.env.REACT_APP_API_URL + '/' + res.data.avatar })
            dispatch(actions.controllLoading(false))
        }).catch(err => {
            console.log('err >>', err);
            dispatch(actions.controllLoading(false))
        })
    }, [])


    const onImageChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            let reader = new FileReader()
            reader.onload = (e) => {
                console.log(reader.result);
                setProfileData({
                    ...profileData, avatar: reader.result, file: file
                })
                setIsSelectedFile(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateAvatar = async () => {
        let formData = new FormData()
        formData.append('avatar', profileData.file)
        try {
            dispatch(actions.controllLoading(true))
            await requestApi('/users/upload-avatar', 'POST', formData, 'json', 'multipart/form-data')
            setIsSelectedFile(false)
            dispatch(actions.controllLoading(false))
            toast.success('Avatar has been updated successfully!', { position: 'top-center', autoClose: 2000 })
        } catch (error) {
            console.log(error);
            setIsSelectedFile(false)
            dispatch(actions.controllLoading(false))
        }
    }

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Profile</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item active">Update avatar</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className='col-md-4'>
                                    <img src={profileData.avatar ? profileData.avatar : '../assets/images/default-avatar.png'} className="img-thumbnail rounded mb-2" alt="..." />
                                    <div className="input-file float-start">
                                        <label htmlFor="file" className="btn-file btn-sm btn btn-primary">Browse Files</label>
                                        <input id="file" type="file" onChange={onImageChange} accept="image/*" style={{ display: 'none' }} />
                                    </div>
                                    {isSelectedFile &&
                                        <button className='btn btn-sm btn-success float-end' onClick={handleUpdateAvatar} >Update</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile