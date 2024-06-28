import { Typography } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Reminders from '../dashboard/lead/view/Reminders';
import TaskReminder from './TaskReminder';
import { Button } from '@mui/joy';
import Attachments from '../dashboard/lead/view/Attachments';

const TaskInfo = () => {
    const taskModalData = useSelector(state => state.task?.modal);
    const statusData = useSelector(state => state.task?.status);
    const [reminderOpen, setReminderOpen] = useState(false);
  return (
    <div>
      <Typography
        id="modal-desc"
        textColor="text.secondary"
        mb={3}
        >
        <b>Task Info</b>
        <p className='text-sm '>Created At <span className='text-blue-500 underline'>{taskModalData?.dateadded?.split("T")[0]}</span></p>
        <hr className="my-3" />
        <p className='text-sm my-2 text-slate-500'>Status <span className='text-blue-500 underline'>{statusData?.data?.find(field => field.id === taskModalData?.status)?.name}</span></p>
        <p className='text-sm my-2 text-slate-500'>Start Date <span className='text-slate-950'>{taskModalData?.startdate?.split("T")[0]}</span></p>
        <p className='text-sm my-2 text-slate-500'>Due Date <span className='text-slate-950'>{taskModalData?.duedate?.split("T")[0]}</span></p>
        <p className='text-sm my-2 text-slate-500'>Priority <span className='text-blue-500 underline'>{taskModalData?.priority}</span></p>
        <p className='text-sm my-2 text-slate-500'>Hourly Rate <span className='text-slate-950'>{taskModalData?.hourly_rate}</span></p>
        <p className='text-sm my-2 text-slate-500'>Billable <span className='text-slate-950'>{taskModalData?.billable === 0? "Yes":"No"}</span></p>
        <div className='my-2'>
            <Button variant="outlined" color="neutral" onClick={() => setReminderOpen(true)}>
                Add Reminder
            </Button>
            <TaskReminder open={reminderOpen} setOpen={setReminderOpen} />
        </div>
        <div className='my-2'>
            <Attachments from="task" />
        </div>
    </Typography>
    </div>
  )
}

export default TaskInfo
