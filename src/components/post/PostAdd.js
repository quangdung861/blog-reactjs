import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import { toast } from 'react-toastify'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../../helpers/CustomUploadAdapter'

const PostAdd = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, setValue, handleSubmit, trigger, formState: { errors } } = useForm();
    const [thumbnail, setThumbnail] = useState('')
    const [categories, setCategories] = useState([])

    const handleSubmitFormAdd = async (data) => {
        let formData = new FormData();
        for (let key in data) {
            if (key == 'thumbnail') {
                formData.append(key, data[key][0])
            } else {
                formData.append(key, data[key])
            }
        }
        dispatch(actions.controllLoading(true))
        try {
            await requestApi('/posts', 'POST', formData, 'json', 'multipart/form-data')
            dispatch(actions.controllLoading(false));
            toast.success('Post has been created successfully!', { position: 'top-center', autoClose: 2000 })
            setTimeout(() => navigate('/posts'), 3000)
        } catch (error) {
            console.log("error >>", error);
            dispatch(actions.controllLoading(false))
        }
    }

    useEffect(() => {
        dispatch(actions.controllLoading(true));
        requestApi('/categories', 'GET').then(res => {
            setCategories(res.data.data)
            dispatch(actions.controllLoading(false));
        }).catch(err => {
            console.log(err);
            dispatch(actions.controllLoading(false));

        })
    }, [])

    const onThumbnailChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setThumbnail(reader.result)
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    function uploadPlugin( editor ) {
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // Configure the URL to the upload script in your backend here!
            return new CustomUploadAdapter( loader );
        };
    }

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">New post</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to='/users'>Posts</Link></li>
                        <li className="breadcrumb-item active">Add new</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-plus me-1"></i>
                            Add
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <form>
                                    <div className="col-md-6">
                                        <div className="mb-3 mt-3">
                                            <label className="form-label">Title:</label>
                                            <input {...register('title', { required: "Title is required." })} type="text" className="form-control" placeholder="Enter title" />
                                            {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Summary:</label>
                                            <textarea rows='4' {...register('summary', { required: "Summary is required." })} className="form-control" placeholder="Enter summary"></textarea>
                                            {errors.summary && <p style={{ color: 'red' }}>{errors.summary.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description:</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                // data="<p>Hello from CKEditor&nbsp;5!</p>"
                                                onReady={editor => {
                                                    register('description', { required: "Description is required." })
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    console.log('Data >> ', data);
                                                    setValue('description', data);
                                                    trigger('description')
                                                }}
                                                config={{
                                                    extraPlugins: [ uploadPlugin ]
                                                }}
                                            />
                                            {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
                                        </div>
                                        <div className="mb-3 mt-3">
                                            <label className="form-label">Thumbnail:</label><br />
                                            {thumbnail && <img style={{ width: '300px' }} src={thumbnail} className='mb-2' alt='...' />}
                                            <div className='input-file'>
                                                <label htmlFor='file' className='btn-file btn-sm btn btn-primary'>Browse files</label>
                                                <input id='file' type='file' name='thumbnail' {...register('thumbnail', { required: "Thumbnail is required.", onChange: onThumbnailChange })} style={{ display: 'none' }} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Category:</label>
                                            <select {...register('category', { required: "Category is required." })} className="form-select"  >
                                                <option value=''>--Select a category--</option>
                                                {categories?.map(cat => { return <option key={cat.id} value={cat.id}>{cat.name}</option> })}
                                            </select>
                                            {errors.category && <p style={{ color: 'red' }}>{errors.category.message}</p>}
                                        </div>
                                        <div className="mt-3 mb-3">
                                            <label className="form-label">status:</label>
                                            <select {...register('status')} className="form-select">
                                                <option value="1">Active</option>
                                                <option value="2">Inactive</option>
                                            </select>
                                        </div>
                                        <button type="button" onClick={handleSubmit(handleSubmitFormAdd)} className="btn btn-success">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>)
}
export default PostAdd