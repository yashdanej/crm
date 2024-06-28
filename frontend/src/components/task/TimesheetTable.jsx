import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getTaskTimer, updateTaskTimer } from '../../store/slices/TaskSlices';

const TimesheetTable = ({getTimer}) => {
    const taskModalData = useSelector(state => state.task.modal);
    const taskTimerData = useSelector(state => state.task.timer);
    
    const calculateDuration = (start, end) => {
        const diff = new Date(end) - new Date(start); // difference in milliseconds
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const dispatch = useDispatch();

    const onEnd = (id) => {
        try {
            dispatch(updateTaskTimer(id));
        } catch (error) {
            console.log("error in updateTaskTimer");            
        } finally {
            getTimer();
        }
    }
   
    useEffect(() => {
        getTimer();
    }, []);
  return (
    <div>
      {
        taskTimerData && taskTimerData.isLoading ? "Loading..." :
        taskTimerData?.data && taskTimerData?.data?.length > 0 &&
        <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] my-5" data-tab-for="order" data-page="active">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">START</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">END</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {taskTimerData?.data?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.id}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.start_time?.split("T")[0]}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.end_time?.split("T")[0]}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.end_time?calculateDuration(item?.start_time, item?.end_time): <span className='cursor-pointer' onClick={() => onEnd(item?.id)}>End Timer</span> }</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  )
}

export default TimesheetTable
