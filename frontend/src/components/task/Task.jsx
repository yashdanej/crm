import React from 'react'
import TaskTable from './TaskTable'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import Add from '@mui/icons-material/Add'

const Task = () => {
  return (
    <div className='m-6'>
        <div className='mb-4'>
            <Link to="/admin/task/add">
                <Button
                    variant="soft"
                    color="primary"
                    startDecorator={<Add />}
                    >
                    Add Task
                </Button>
            </Link>
        </div>
        <div className="bg-white border border-1 rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
                <TaskTable/>
            </div>
        </div>
    </div>
  )
}

export default Task
