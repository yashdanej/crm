import React, { useEffect } from 'react'
import { emptyComment, getTaskComments } from '../../store/slices/TaskSlices';
import { useDispatch, useSelector } from 'react-redux';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const CommentTable = () => {
    const taskModalData = useSelector(state => state.task.modal);
    const taskCommentData = useSelector(state => state.task.comment);
    const usersData = useSelector(state => state.assigned.assignedData);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTaskComments(taskModalData.id));
        return () => {
            dispatch(emptyComment());
        }
    }, []);
    console.log("taskCommentData", taskCommentData);
  return (
    <div>
      {
        taskCommentData && taskCommentData.isLoading ? "Loading..." :
        taskCommentData?.data && taskCommentData?.data?.length > 0 &&
        <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] my-5" data-tab-for="order" data-page="active">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">COMMENT</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">COMMENTED BY</th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Download</th>
            </tr>
          </thead>
          <tbody>
            {taskCommentData?.data?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.id}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{item?.content}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <p className="text-[13px] font-medium text-gray-400">{usersData?.find(field => field.id === item?.staffid)?.full_name}</p>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                    {
                        item?.file?
                        <a className="cursor-pointer" href={item?.file} target="_blank" download>
                            <ArrowCircleDownIcon />
                        </a>:<p className="text-[13px] font-medium text-gray-400">NO FILE</p>
                    }
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

export default CommentTable
