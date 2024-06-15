import React, { useState } from 'react'
import { getDesignation, get_Currency, get_Group } from '../../../../store/slices/SetupSlices';
import { api } from '../../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';

const CurrencyTable = ({handleEdit}) => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const getAllAgents = () => {
        api("/util/currency", "get", false, false, true)
        .then((res) => {
            dispatch(get_Currency(res.data.data));
        })
        .catch((err) => {
            console.log("error in getallagents", err);
        })
    }
    const dispatch = useDispatch();
    const currencyData = useSelector(state => state.setup.setupCurrency);
    const handleDelete = (id) => {
        api(`/util/currency/${id}`, "delete", false, false, true)
        .then((res) => {
            console.log("res in delete", res);
            getAllAgents();
        })
        .catch((err) => {
            console.log("err in delete", err);
        })
    }
    
  return (
    <div className='setup w-full h-[70vh] overflow-auto'>
        <table className="table-fill">
            <thead>
                <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">NAME</th>
                    <th className="text-left">EDIT</th>
                    <th className="text-left">DELETE</th>
                </tr>
            </thead>
            <tbody className="table-hover">
                {
                    currencyData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.name}</td>
                                <td className="text-left cursor-pointer" onClick={() => handleEdit(item.id)}>Edit</td>
                                <td className="text-left cursor-pointer" onClick={() => handleDelete(item.id)}>Delete</td>
                            </tr>
                        )
                    })
                }
                
            </tbody>
        </table>
    </div>
  )
}

export default CurrencyTable
