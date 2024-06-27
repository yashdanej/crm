import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, getTask, getTaskAssign, getTaskById, getTaskStatus, updateTaskStatus } from '../../store/slices/TaskSlices';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from 'react-router-dom';
import { changeText } from '../../utils/Utils';

const TaskTable = () => {
    const [assignedUsers, setAssignedUsers] = useState({});
    const taskData = useSelector(state => state.task.task);
    const usersData = useSelector(state => state.assigned.assignedData);
    const statusData = useSelector(state => state.task.status);

    const dispatch = useDispatch();

    const handleGetTask = () => {
        dispatch(getTask());
    };
    const handleGetStatus = () => {
        dispatch(getTaskStatus());
    }

    const onStatusChange = (taskid, status) => {
        dispatch(updateTaskStatus({id: taskid, status}));
    }

    const handleGetTaskAssign = async (id) => {
        const response = await dispatch(getTaskAssign(id));
        setAssignedUsers(prevState => ({
            ...prevState,
            [id]: response.payload
        }));
    };

    useEffect(() => {
        handleGetTask();
        handleGetStatus();
    }, []);

    useEffect(() => {
        if (taskData?.data) {
            taskData.data.forEach(task => {
                handleGetTaskAssign(task.id);
            });
        }
    }, [taskData]);
    console.log("assignedUsers", assignedUsers);
    
    const navigate = useNavigate();
    const onEdit = (id) => {
        dispatch(getTaskById(id));
        navigate("/admin/task/add");
    }

    const onDelete = (id) => {
        dispatch(deleteTask(id));
    }

    return (
        <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
            <thead>
                <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Name</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Status</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Start Date</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Due Date</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Assigned To</th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Priority</th>
                </tr>
            </thead>
            <tbody>
                {taskData &&
                    taskData?.data?.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <p className="text-[13px] font-medium text-gray-400">{item?.id}</p>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <p className="text-[13px] font-medium text-gray-400">{item?.name}</p>
                                <span onClick={() => onEdit(item.id)} className="text-xs hover:underline cursor-pointer text-green-950"> {taskData?.edit?.isLoading ?"--Loading":"Edit"} </span>
                                <span className="text-xs hover:underline cursor-pointer">/</span>
                                <span onClick={() => onDelete(item.id)} className="text-xs hover:underline cursor-pointer text-red-950"> Delete</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <select onChange={(e) => onStatusChange(item.id, e.target.value)} name='priority' id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {
                                        statusData?.data?.map((status) => {
                                            return (
                                                <option selected={status?.id === item?.status} value={status?.id}>{status.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{item?.startdate?.split("T")[0]}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{item?.duedate?.split("T")[0]}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">
                                    {
                                        assignedUsers[item?.id]?.length > 0 ?
                                        <div className="flex -space-x-4 rtl:space-x-reverse">
                                            {
                                                assignedUsers[item?.id].map((assignedItem) => {
                                                    const user = usersData?.find(user => user.id === assignedItem?.staffid);
                                                    return (
                                                        user && (
                                                            <Tippy content={user.full_name} key={assignedItem?.id}>
                                                                <Link to={`/activity_log/${user.id}`}><img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src={user.profile_img || "/images/unknown.jpg"} alt={user.full_name} /></Link>
                                                            </Tippy>
                                                        )
                                                    );
                                                })
                                            }
                                        </div> :
                                        "No assigned user found"
                                    }
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{item?.priority}</span>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default TaskTable;
