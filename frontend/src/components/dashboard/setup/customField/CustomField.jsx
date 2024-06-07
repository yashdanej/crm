import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api } from '../../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveStatus, deleteCustomField, fetchCustomFields, getCustomField } from '../../../../store/slices/SetupSlices';
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
    
    // active change
    const handleActiveChange = (id) => {
        dispatch(changeActiveStatus(id));
    }

    // delete custom field
    const handleDeleteField = (id) => {
        dispatch(deleteCustomField(id));
    }
    useEffect(() => {
        dispatch(fetchCustomFields());
    }, [])

    const handleEditField = (id) => {
        dispatch(getCustomField(id));
        navigate("/setup/custom_field/add");
    }
    // activity log
    useEffect(() => {
        api("/util/last_active", "patch", false, false, true)
        .then((res) => {
        console.log("res", res);
        })
        .catch((err) => {
        console.log("err in activity log");
        });
    }, []);

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
                                                <span onClick={() => handleEditField(item.id)} className='text-xs hover:underline cursor-pointer text-green-950'>Edit </span>
                                                <span className='text-xs hover:underline cursor-pointer'>/</span>
                                                <span onClick={() => handleDeleteField(item.id)} className='text-xs hover:underline cursor-pointer text-red-950'> Delete</span>
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
                                            <label class="inline-flex items-center cursor-pointer">
                                                <input onChange={() => handleActiveChange(item.id)} checked={item.active} type="checkbox" value="" class="sr-only peer"/>
                                                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
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
