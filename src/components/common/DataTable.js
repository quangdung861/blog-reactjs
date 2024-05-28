import React, { useEffect, useState } from 'react'
import LiveSearch from './LiveSearch';

const DataTable = (props) => {
    const { name, data, columns, currentPage, numOfPage, onPageChange, onChangeItemsPerPage, onKeySearch, itemsPerPage, selectedRows, setSelectedRows } = props;

    const renderHeaders = () => {
        return columns.map((col, index) => <th key={index} scope="col">{col.name}</th>)
    }

    const renderData = () => {
        return (
            data.map((item, index) => (
                <tr key={index}>
                    <td><input type='checkbox' checked={selectedRows.includes(String(item.id))} value={item.id} className='form-check-input' onChange={onClickCheckbox} /></td>
                    {
                        columns.map((col, index) => <td key={index}>{col.element(item)}</td>)
                    }
                </tr>
            ))
        )
    }

    const onClickCheckbox = (event) => {
        let checked = event.target.checked;
        let value = event.target.value;
        if (checked) {
            if (!selectedRows.includes(value)) {
                setSelectedRows([...selectedRows, value])
            }
        } else {
            let index = selectedRows.indexOf(value)
            const temp = [...selectedRows];
            temp.splice(index, 1)
            setSelectedRows(temp)
        }
    }

    const onSelectAll = (event) => {
        if (event.target.checked) {
            const temp = data.map(element => String(element.id))
            setSelectedRows(temp)
        } else {
            setSelectedRows([])
        }
    }

    const handleonPageChange = (page) => {
        setSelectedRows([])
        onPageChange(page)
    }

    const renderPagination = () => {
        const pagination = [];
        const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
        const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;

        pagination.push(
            <li key="prev" className={prevPage ? "page-item" : "page-item disabled"}>
                <button className='page-link' onClick={() => handleonPageChange(prevPage)}>&laquo;</button>
            </li>
        )

        for (let i = 1; i <= numOfPage; i++) {
            pagination.push(
                <li key={i} className={currentPage === i ? "page-item active" : "page-item"}>
                    <button className='page-link' onClick={() => handleonPageChange(i)}>{i}</button>
                </li>
            )
        }

        pagination.push(
            <li key='next' className={nextPage ? "page-item" : "page-item disabled"}>
                <button className='page-link' onClick={() => handleonPageChange(nextPage)}>&raquo;</button>
            </li>
        )
        return pagination;
    }

    const onChangeOption = (event) => {
        const target = event.target;
        onChangeItemsPerPage(target.value)
    }

    return (
        <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                {name}
            </div>
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-sm-12 col-md-6">
                        <label className='d-inline-flex'>Show
                            <select name="example length" value={itemsPerPage} className="form-select form-select-sm ms-1 me-1" onChange={onChangeOption}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select> entries
                        </label>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <label className='d-inline-flex float-end' >Search:
                            <LiveSearch onKeySearch={onKeySearch} />
                        </label>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <td><input checked={selectedRows.length === data.length && data.length > 0 ? true : false} type='checkbox' className='form-check-input' onChange={onSelectAll} /></td>
                            {renderHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {renderData()}
                    </tbody>
                </table>
                {numOfPage > 1 &&
                    <div className='row'>
                        <div className='col-sm-12 col-md-7'>
                            <ul className="pagination justify-content-end">
                                {renderPagination()}
                            </ul>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default DataTable