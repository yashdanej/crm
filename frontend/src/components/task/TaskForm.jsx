import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api, changeText } from '../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer } from '../../store/slices/CustomerSlices';
import { getAllLeads } from '../../store/slices/LeadSlices';
import Editor from './Editor';
import { useNavigate } from 'react-router-dom';
import { addAssignedTask, addFollowerTask, addTask, emptyTaskAssignEdit, emptyTaskEdit, emptyTaskFollowerEdit, getTaskAssignedById, getTaskFollowerById, updateTask, updateTaskAssigned, updateTaskFollower } from '../../store/slices/TaskSlices';
import TaskModal from './TaskModal';

const TaskForm = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const [open, setOpen] = useState(false);
    
    let getUser = JSON.parse(localStorage.getItem("user"));
    const [content, setContent] = useState(``);
    const [tblAssigned, setTblAssigned] = useState({
        staffid: `${getUser.id}`,  // Use a string to store IDs as comma-separated values
        taskid: null,
        is_assigned_from_contact: 0
    });
    const [tblFollower, setTblFollower] = useState({
        staffid: "",  // Use a string to store IDs as comma-separated values
        taskid: null,
    });
    const taskFolloowerChangeText = (event, setTblFollower, tblFollower) => {
        const { name, options } = event.target;
        const selectedIds = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value)
            .join(",");  // Join selected IDs with commas to form a string
    
            setTblFollower({ ...tblFollower, [name]: selectedIds });
    };
    useEffect(() => {
        console.log("tblAssigned", tblAssigned);
        console.log("tblFollower", tblFollower);
    }, [tblAssigned, tblFollower]);
    const taskChangeText = (event, setTblAssigned, tblAssigned) => {
        const { name, options } = event.target;
        const selectedIds = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value)
            .join(",");  // Join selected IDs with commas to form a string
    
        setTblAssigned({ ...tblAssigned, [name]: selectedIds });
    };
    
    const customerData = useSelector(state => state.customer.customers);
    const leadsData = useSelector((state) => state.leads.leadsData);
    const usersData = useSelector(state => state.assigned.assignedData);
    const tasksData = useSelector(state => state.task.task);
    const taskAssignData = useSelector(state => state.task.task_assign);
    const taskFollowerData = useSelector(state => state.task.task_follower);

    const dispatch = useDispatch();
    const [infinity, setInfinity] = useState(true);
    const [task, setTask] = useState({
        name: "",
        description: ``,
        priority: "Medium",
        dateadded: "",
        startdate: new Date().toISOString().substr(0, 10),
        duedate: null,
        datefinished: null,
        addedfrom: 0,
        is_added_from_contact: 0,
        status: 0,
        recurring_type: "",
        repeat_every: 1,
        recurring: 0,
        is_recurring_from: null,
        cycles: 0,
        total_cycles: 0,
        custom_recurring: 0,
        last_recurring_date: null,
        rel_id: null,
        rel_type: null,
        is_public: 0,
        billable: 0,
        billed: 0,
        invoice_id: 0,
        hourly_rate: 0.00,
        milestone: 0,
        kanban_order: 0,
        milestone_order: 0,
        visible_to_client: 0,
        deadline_notified: 0
    });

    const AssignedUserByTask = (id) => {
        dispatch(getTaskAssignedById(id));
    }
    const FollowerUserByTask = (id) => {
        dispatch(getTaskFollowerById(id));
    }

    useEffect(() => {
        if (tasksData && tasksData.edit && tasksData.edit.data.length > 0) {
            const data = tasksData.edit.data[0];
            setTask(prevTask => ({
                ...prevTask,
                name: data.name || "",
                description: data.description || "",
                priority: data.priority || "Medium",
                dateadded: data.dateadded || "",
                startdate: new Date(data.startdate)?.toISOString().substr(0, 10) || new Date().toISOString().substr(0, 10),
                duedate: new Date(data.duedate)?.toISOString().substr(0, 10) || null,
                datefinished: data.datefinished || null,
                addedfrom: data.addedfrom || 0,
                is_added_from_contact: data.is_added_from_contact || 0,
                status: data.status || 0,
                recurring_type: data.recurring_type || "",
                repeat_every: data.repeat_every || 1,
                recurring: data.recurring || 0,
                is_recurring_from: data.is_recurring_from || null,
                cycles: data.cycles || 0,
                total_cycles: data.total_cycles || 0,
                custom_recurring: data.custom_recurring || 0,
                last_recurring_date: data.last_recurring_date || null,
                rel_id: data.rel_id || null,
                rel_type: data.rel_type || null,
                is_public: data.is_public || 0,
                billable: data.billable || 0,
                billed: data.billed || 0,
                invoice_id: data.invoice_id || 0,
                hourly_rate: data.hourly_rate || 0.00,
                milestone: data.milestone || 0,
                kanban_order: data.kanban_order || 0,
                milestone_order: data.milestone_order || 0,
                visible_to_client: data.visible_to_client || 0,
                deadline_notified: data.deadline_notified || 0
            }));
            AssignedUserByTask(data.id);
            FollowerUserByTask(data.id);
        }
    }, [tasksData]);

    useEffect(() => {
        if(tasksData && tasksData.edit && tasksData.edit.data.length > 0){
            // Extract staff ids from taskAssignData and taskFollowerData
            const assignStaffIds = taskAssignData?.edit?.data?.map(item => item.staffid);
            const followerStaffIds = taskFollowerData?.edit?.data?.map(item => item.staffid);
    
            console.log("assignStaffIds", assignStaffIds);
            console.log("followerStaffIds", followerStaffIds);
            // Filter usersData based on extracted staff ids
            const filteredAssignUsers = usersData.filter(user => assignStaffIds.includes(user.id));
            const filteredFollowerUsers = usersData.filter(user => followerStaffIds.includes(user.id));
    
            console.log("filteredAssignUsers", filteredAssignUsers);
            console.log("filteredFollowerUsers", filteredFollowerUsers);
    
            // Update the dropdown menu options
            setFilteredUsers(assignStaffIds)
            setFilteredFollowers(followerStaffIds)
            setTblAssigned(prevState => ({
                ...prevState,
                staffid: assignStaffIds.join(',')
            }));
            setTblFollower(prevState => ({
                ...prevState,
                staffid: followerStaffIds.join(',')
            }));
        }
    }, [taskAssignData, taskFollowerData, usersData]);

    // useEffect(() => {

    //     // assigned
    //     // Extract staff ids from taskAssignData
    //     const staffIds = taskAssignData?.edit?.data?.map(item => item.staffid);

    //     // Filter usersData based on extracted staff ids
    //     const filteredUsers = usersData.filter(user => staffIds?.includes(user.id));

    //     // Update the dropdown menu options
    //     setFilteredUsers(filteredUsers);

    //     // assigned
    //     // Extract staff ids from taskAssignData
    //     const fstaffIds = taskFollowerData?.edit?.data?.map(item => item.staffid);

    //     // Filter usersData based on extracted staff ids
    //     const ffilteredUsers = usersData.filter(user => fstaffIds?.includes(user.id));

    //     // Update the dropdown menu options
    //     setFilteredUsers(filteredUsers);
    //     setFilteredFollowers(ffilteredUsers);

    // }, [taskAssignData, taskFollowerData, usersData]);

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredFollowers, setFilteredFollowers] = useState([]);

    const resetTaskValues = () => {
        setTask({
            name: "",
            description: ``,
            priority: "Medium",
            dateadded: "",
            startdate: new Date().toISOString().substr(0, 10),
            duedate: null,
            datefinished: null,
            addedfrom: 0,
            is_added_from_contact: 0,
            status: 0,
            recurring_type: "",
            repeat_every: 1,
            recurring: 0,
            is_recurring_from: null,
            cycles: 0,
            total_cycles: 0,
            custom_recurring: 0,
            last_recurring_date: null,
            rel_id: null,
            rel_type: null,
            is_public: 0,
            billable: 0,
            billed: 0,
            invoice_id: 0,
            hourly_rate: 0.00,
            milestone: 0,
            kanban_order: 0,
            milestone_order: 0,
            visible_to_client: 0,
            deadline_notified: 0
        });
    }
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if(task.name === ""){
            setSnackbarProperty({
                text: "Name is required.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }else{
            try {
                if (tasksData && tasksData.edit && tasksData.edit.data.length > 0) {
                    await dispatch(updateTask({ id: tasksData.edit.data[0].id, data: task })).unwrap();
                    setSnackbarProperty({
                        text: "Task updated successfully!",
                        color: "success"
                    });
                    dispatch(updateTaskAssigned({id: tasksData.edit.data[0].id, data: tblAssigned}));
                    dispatch(updateTaskFollower({id: tasksData.edit.data[0].id, data: tblFollower}));
                    dispatch(emptyTaskAssignEdit());
                    dispatch(emptyTaskFollowerEdit());
                    resetTaskValues();
                    setOpen(true);
                } else {
                    const getThatTask = await dispatch(addTask(task)).unwrap();
                    setSnackbarProperty({
                        text: "Task added successfully!",
                        color: "success"
                    });
                    setTblAssigned(prev => ({...prev, taskid: getThatTask?.data[0]?.id}));
                    setTblFollower(prev => ({...prev, taskid: getThatTask?.data[0]?.id}));
                    console.log("getThatTask", getThatTask);
                    dispatch(emptyTaskAssignEdit());
                    dispatch(emptyTaskFollowerEdit());
                    resetTaskValues();
                    setOpen(true);
                }
            } catch (error) {
                setSnackbarProperty({
                    text: error, // Display the error message
                    color: "danger"
                });
            } finally {
                setSnackAlert(true);
            }
        }
    }
    useEffect(() => {
        if (tblAssigned.taskid) {
            dispatch(addAssignedTask(tblAssigned));
        }
        if(tblFollower.taskid){
            dispatch(addFollowerTask(tblFollower));
        }
    }, [tblAssigned, tblFollower]);
    useEffect(() => {
        console.log("task", task);
    }, [task]);
    useEffect(() => {
        if(task.recurring_type !== ""){
            setTask({...task, recurring: 1})
        }else{
            setTask({...task, recurring: 0})
        }
    }, [task.recurring_type]);
    useEffect(() => {
        if(infinity){
            setTask({...task, total_cycles: 0})
        }
    }, [infinity]);
    useEffect(() => {
        if(task?.rel_type === "Customer"){
            dispatch(getCustomer());
        }else if(task?.rel_type === "Lead"){
            let query = "";
            api(`/lead/getleads?${query}`, "get", false, false, true)
            .then((res) => {
                console.log("res from getLeads", res);
                dispatch(getAllLeads(res.data.data));
            })
            .catch((err) => {
                console.log("err from getLeads", err);
            })
            .finally(() => {
                console.log("Completed");
            });
        }
    }, [task?.rel_type]);
    useEffect(() => {
        console.log("content", content);
    }, [content]);

  return (
    <div className='mx-6 my-10'>
        <TaskModal open={open} setOpen={setOpen} />
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='w-[65%] m-auto'>
            <label for="first_name" className="block mb-2 text-xl font-semibold text-slate-600">Add Task</label>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='bg-slate-100 border px-6 py-5 flex items-center'>
                    <div className='w-[48%] flex items-center'>
                        <div className='flex item-center'>
                            <input checked={task?.is_public} name="is_public" onChange={(event) => setTask({...task, [event.target.name]: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
                        </div>
                        <div className='mx-4 flex item-center'>
                            <input checked={task?.billable} name="billable" onChange={(event) => setTask({...task, [event.target.name]: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Billable</label>
                        </div>
                    </div>
                </div>
                <div className='p-6'>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        <span className='text-red-500'>* </span>Name
                        </label>
                        <input
                        value={task.name}
                        onChange={(e) => changeText(e, setTask, task)}
                        name="name"
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Name"
                        required
                        />
                    </div>

                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Hourly Rate
                        </label>
                        <input
                        value={task.hourly_rate}
                        onChange={(e) => changeText(e, setTask, task)}
                        name="hourly_rate"
                        type="number"
                        id="hourly_rate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Hourly Rate"
                        />
                    </div>
                    
                    <div className='md:flex md:justify-between md:gap-10'>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Start Date</label>
                            <input
                            value={task.startdate}
                            onChange={(e) => changeText(e, setTask, task)}
                            name="startdate"
                            type="date"
                            id="startdate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder=""
                            />
                        </div>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Due Date</label>
                            <input
                            value={task.duedate}
                            onChange={(e) => changeText(e, setTask, task)}
                            name="duedate"
                            type="date"
                            id="duedate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder=""
                            />
                        </div>
                    </div>
                    <div className='md:flex md:justify-between md:gap-10'>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Priority</label>
                            <div className='flex items-center'>
                            <select value={task?.priority} name='priority' onChange={(event) => changeText(event, setTask, task)} id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected={task?.priority === "Low"} value="Low">Low</option>
                                <option selected={task?.priority === "Medium"} value="Medium">Medium</option>
                                <option selected={task?.priority === "High"} value="High">High</option>
                                <option selected={task?.priority === "Urgent"} value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                       
                    </div>
                    <div className='md:flex md:justify-between md:gap-10'>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Every</label>
                            <input
                            value={task.repeat_every}
                            onChange={(e) => changeText(e, setTask, task)}
                            name="repeat_every"
                            type="number"
                            id="repeat_every"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder=""
                            />
                        </div>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Repeat</label>
                            <div className='flex items-center'>
                                <select name='recurring_type' onChange={(event) => changeText(event, setTask, task)} id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected={task?.recurring_type === ""} value=""></option>
                                    <option selected={task?.recurring_type === "Day"} value="Day">Day</option>
                                    <option selected={task?.recurring_type === "Week"} value="Week">Week</option>
                                    <option selected={task?.recurring_type === "Month"} value="Month">Month</option>
                                    <option selected={task?.recurring_type === "Year"} value="Year">Year</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {
                        task?.recurring_type !== "" &&
                        <div className='my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                            Total Cycles
                            </label>
                            <div class="relative">
                                <input
                                value={task.total_cycles}
                                onChange={(e) => changeText(e, setTask, task)}
                                name="total_cycles"
                                type="number"
                                id="total_cycles"
                                disabled={infinity}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200"
                                placeholder="Total Cycles"
                                />
                                <button type="submit" class="flex items-center text-white absolute end-2.5 bottom-1 bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-4 py-2">
                                    <input checked={infinity} name="infinity" onChange={(event) => setInfinity(event.target.checked)} id="link-checkbox" type="checkbox" value="" className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    Infinite
                                </button>
                            </div>
                        </div>
                    }

                    <div className='md:flex md:justify-between md:gap-10'>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Related To</label>
                            <select name='rel_type' onChange={(event) => changeText(event, setTask, task)} id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected={task?.rel_type === ""} value=""></option>
                                {/* <option selected={task?.rel_type === "Project"} value="Project">Project</option> */}
                                {/* <option selected={task?.rel_type === "Invoice"} value="Invoice">Invoice</option> */}
                                <option selected={task?.rel_type === "Customer"} value="Customer">Customer</option>
                                {/* <option selected={task?.rel_type === "Estimate"} value="Estimate">Estimate</option> */}
                                {/* <option selected={task?.rel_type === "Contract"} value="Contract">Contract</option> */}
                                {/* <option selected={task?.rel_type === "Ticket"} value="Ticket">Ticket</option> */}
                                {/* <option selected={task?.rel_type === "Expense"} value="Expense">Expense</option> */}
                                <option selected={task?.rel_type === "Lead"} value="Lead">Lead</option>
                                {/* <option selected={task?.rel_type === "Proposal"} value="Proposal">Proposal</option> */}
                            </select>
                        </div>
                        {
                            task?.rel_type === "Customer"?
                            (
                                <div className='w-full my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">{task?.rel_type}</label>
                                    <div className='flex items-center'>
                                        <select name='rel_id' onChange={(event) => changeText(event, setTask, task)} id="rel_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {
                                            customerData?.data?.map((item) => {
                                                return (
                                                    <option selected={task?.rel_id === item.id} value={item.id}>{item.company}</option>
                                                )
                                            })
                                        }
                                        </select>
                                    </div>
                                </div>
                            ) :
                            task?.rel_type === "Lead"?
                            (
                                <div className='w-full my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">{task?.rel_type}</label>
                                    <div className='flex items-center'>
                                        <select name='rel_id' onChange={(event) => changeText(event, setTask, task)} id="rel_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {
                                            leadsData?.map((item) => {
                                                return (
                                                    <option selected={task?.rel_id === item.id} value={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                        </select>
                                    </div>
                                </div>
                            ):null
                        }
                    </div>

                    <div className='md:flex md:justify-between md:gap-10'>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Assignees</label>
                            <div className='flex items-center'>
                                <select
                                    name='staffid'
                                    onChange={(event) => taskChangeText(event, setTblAssigned, tblAssigned)}
                                    id="staffid"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    multiple  // Enable multiple selection
                                >
                                    {
                                        usersData?.map((item) => (
                                            <option selected={
                                                filteredUsers?.find(field => field === item.id)
                                             } key={item.id} value={item.id}>{item.full_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='w-full my-3'>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Followers</label>
                            <div className='flex items-center'>
                                <select
                                    name='staffid'
                                    onChange={(event) => taskFolloowerChangeText(event, setTblFollower, tblFollower)}
                                    id="staffid"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    multiple  // Enable multiple selection
                                >
                                    {
                                        usersData?.map((item) => (
                                            <option selected={
                                                filteredFollowers?.find(field => field === item.id)
                                            } key={item.id} value={item.id}>{item.full_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Task Description</label>
                        <Editor task={task} content={task.description} setContent={setTask} />
                    </div>
                </div>
                <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
                    <button onClick={handleSubmit} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save</button>
                </div>
            </div>
      </div>
    </div>
  )
}

export default TaskForm
