import React, { useState } from 'react'
import { selectedItem } from '../../../../utils/Utils';
import { useSelector } from 'react-redux';

const CardKanban = ({item}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
      };
      const statusData = useSelector(state => state.status.statusData);
      const sourceData = useSelector(state => state.source.sourceData);
  return (
    <div className='p-5 m-5 bg-white'>
        <p>#{item.id} - {item.name}</p>
        <div className='flex justify-between'>
            <p className='font-bold'>Source:</p>
            <p className='font-semibold text-gray-700'>{selectedItem(item, sourceData, "Source")}</p>
        </div>
        <div className='flex justify-between'>
            <p className='font-bold'>Last Contact:</p>
            <p className='font-semibold text-gray-700'>{item.lastcontact}</p>
        </div>
        <div className='flex justify-between'>
            <p className='font-bold'>Created:</p>
            <p className='font-semibold text-gray-700'>{item.dateadded}</p>
        </div>
        <div className='flex justify-between mb-2'>
            <p className='font-bold'>Lead Value:</p>
            <p className='font-semibold text-gray-700'>{item.lead_value}</p>
        </div>
        <button onClick={toggleExpand} className='text-blue-500 underline'>
            {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        {isExpanded && (
            <div className='my-2'>
            <p className='font-bold'>Position:</p>
            <p className='font-semibold text-gray-700'>{item.title}</p>

            <p className='font-bold'>Email Address:</p>
            <p className='font-semibold text-gray-700'>{item.email}</p>

            <p className='font-bold'>Phone:</p>
            <p className='font-semibold text-gray-700'>{item.phonenumber}</p>
            </div>
        )}
    </div>
  )
}

export default CardKanban
