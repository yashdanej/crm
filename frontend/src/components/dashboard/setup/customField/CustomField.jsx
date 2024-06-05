import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api } from '../../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { addToggleOpenInCustomField, fetchCustomFields } from '../../../../store/slices/SetupSlices';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';

const CustomField = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customFieldsData = useSelector(state => state.setup.customFields);
    console.log("customFieldsData", customFieldsData);
    useEffect(() => {
        dispatch(fetchCustomFields());
    }, [])

    if(customFieldsData.isLoading){
        return <p>Loading...</p>
    }else{
        return (
        <div className='m-6'>
            <div className='mb-4'>
                <Link to="/setup/custom_field/add">
                    <Button
                        variant="soft"
                        color="primary"
                        startDecorator={<Add />}
                        >
                        Add Custom Field
                    </Button>
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    {
                        snackAlert ?
                            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
                            : null
                    }
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                            <tr>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Name</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Belongs To</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Type</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Slug</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customFieldsData?.data?.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <p className="text-[13px] font-medium text-gray-400">{item.id}</p>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <p className="text-[13px] font-medium text-gray-400">{item.name}</p>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.fieldto}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.type}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.slug}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.active}</span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )
    }
}

export default CustomField
