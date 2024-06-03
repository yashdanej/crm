import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api } from '../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getAssigned } from '../../../store/slices/LeadSlices';
import { Link } from 'react-router-dom';

const Users = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const users = useSelector(state => state.assigned.assignedData)
    const dispatch = useDispatch();
    const getUsers = () => {
        let getUser = JSON.parse(localStorage.getItem("user"));
        api(`/lead/getusers/${getUser.id}`, "get", false, false, true)
        .then((res) => {
            dispatch(getAssigned(res.data.data));
        })
        .catch((err) => {
            console.log("err in getUsers", err);
        });
    }
    useEffect(() => {
        getUsers();
    }, []);

    const onSwitch = (id) => {
        api(`/updaterole/${id}`, "patch", false, false, true)
        .then((res) => {
            setSnackbarProperty(prevState => ({
                ...prevState,
                text: res.data.message,
                color: "success"
            }));
            setSnackAlert(true);
            getUsers();
        })
        .catch((err) => {
            console.log("err in onSwitch", err);
            setSnackbarProperty(prevState => ({
                ...prevState,
                text: err,
                color: "danger"
            }));
            setSnackAlert(true);
        })
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
  return (
    <div className='bg-white rounded-lg shadow-md p-6 m-6'>
        {
        snackAlert ?
        <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
        : null
        }
      <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Full Name</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Email</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Is Admin</th>
            </tr>
        </thead>
        <tbody>
                {
                    users?.map((item) => {
                        return (
                            <tr key={item?.id}>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                <Link to={`/activity_log/${item?.id}`}><span className="text-[13px] font-medium text-gray-400">{item?.id}</span></Link>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                <Link to={`/activity_log/${item?.id}`}><span className="text-[13px] font-medium text-gray-400">{item?.full_name}</span></Link>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                <Link to={`/activity_log/${item?.id}`}><span className="text-[13px] font-medium text-gray-400">{item?.email}</span></Link>
                                </td>
                                <label className="inline-flex items-center cursor-pointer my-2">
                                    <input onChange={() => onSwitch(item?.id)} checked={item.role === 2} type="checkbox" value="" className="sr-only peer"/>
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </tr>
                        )
                    })
                }
        </tbody>
    </table>
    </div>
  )
}

export default Users
