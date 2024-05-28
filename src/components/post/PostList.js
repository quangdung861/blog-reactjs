import React, { useEffect, useState } from 'react'
import DataTable from '../common/DataTable'
import requestApi from '../../helpers/api'
import { useDispatch } from 'react-redux'
import * as actions from "../../redux/actions"
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../helpers/common'

const PostList = () => {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([])
    const [numOfPage, setNumOfPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const [searchString, setSearchString] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleteType, setDeleteType] = useState('single')
    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(Date.now())

    const columns = [
        {
            name: "ID",
            element: row => row.id
        },
        {
            name: "Title",
            element: row => row.title
        },
        {
            name: "Thumbnail",
            element: row => <img width='70px' src={process.env.REACT_APP_API_URL + '/' + row.thumbnail} alt='' />
        },
        // {
        //     name: "Description",
        //     element: row => row.description
        // },
        {
            name: "Author",
            element: row => row.user.first_name
        },
        {
            name: "Status",
            element: row => row.status === 1 ? "Active" : "Inactive"
        },
        {
            name: "created at",
            element: row => formatDateTime(row.created_at)
        },
        {
            name: "Updated at",
            element: row => formatDateTime(row.updated_at)
        },
        {
            name: "Actions",
            element: row => (
                <>
                    <Link to={`/post/edit/${row.id}`} className='btn btn-sm btn-warning me-1'><i className='fa fa-pen'></i></Link>
                    <button type='button' className='btn btn-sm btn-danger me-1' onClick={() => handleDelete(row.id)}><i className='fa fa-trash'></i></button>
                </>
            )
        }
    ]

    const handleDelete = (id) => {
        setShowModal(true)
        setDeleteItem(id)
        setDeleteType('single')
    }

    const handleMultiDelete = () => {
        setShowModal(true)
        setDeleteType('multiple')
    }

    const requestDeleteApi = () => {
        if (deleteType === 'single') {
            dispatch(actions.controllLoading(true))
            requestApi(`/posts/${deleteItem}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setDeleteItem(null)
                setRefresh(Date.now())
                dispatch(actions.controllLoading(false))
            }).catch(err => {
                console.log(err);
                setShowModal(false)
                dispatch(actions.controllLoading(false))
            })
        } else {
            dispatch(actions.controllLoading(true))
            requestApi(`/posts/multiple?ids=${selectedRows.toString()}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setSelectedRows([])
                setRefresh(Date.now())
                dispatch(actions.controllLoading(false))
            }).catch(err => {
                console.log(err);
                setShowModal(false)
                dispatch(actions.controllLoading(false))
            })
        }
    }

    useEffect(() => {
        dispatch(actions.controllLoading(true))
        let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`
        requestApi(`/posts${query}`, 'GET', []).then(response => {
            setPosts(response.data.data)
            setNumOfPage(Number(response.data.lastPage))
            setCurrentPage(Number(response.data.currentPage))
            dispatch(actions.controllLoading(false))
        }).catch(err => {
            console.log(err);
            dispatch(actions.controllLoading(false))
        })
    }, [currentPage, itemsPerPage, searchString, refresh])

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Tables</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'>
                            <Link to='/'>Dashboard</Link>
                        </li>
                        <li className='breadcrumb-item active'>Tables</li>
                    </ol>
                    <div className='mb-3'>
                        <Link className='btn btn-sm btn-success me-2' to='/post/add' ><i className='fa fa-plus'></i> Add new</Link>
                        {
                            selectedRows.length > 0 && <button type='button' className='btn btn-sm btn-danger' onClick={handleMultiDelete}><i className='fa fa-trash'></i> Delete</button>
                        }
                    </div>
                    <DataTable name='List Posts'
                        data={posts}
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onChangeItemsPerPage={setItemsPerPage}
                        onKeySearch={setSearchString}
                        setSelectedRows={setSelectedRows}
                        selectedRows={selectedRows}
                    />
                </div>
            </main>
            <Modal show={showModal} onHide={() => setShowModal(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button className='btn-danger' onClick={requestDeleteApi}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PostList