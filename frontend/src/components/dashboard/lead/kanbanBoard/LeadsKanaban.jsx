import React, { useState } from 'react';

const LeadCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='w-1/5 flex-shrink-0'>
      <div className='bg-slate-100 rounded-lg text-[14px]'>
        <div className='p-3 bg-orange-500 text-white rounded-lg'>
          <p>Free Leads - $0.00 - 3 Leads</p>
        </div>
        <div className='p-5 m-5 bg-white'>
          <p>#201 - Mahendra Tulsian</p>
          <div className='flex justify-between'>
            <p className='font-bold'>Source:</p>
            <p className='font-semibold text-gray-700'>Reference</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Last Contact:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Created:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between mb-2'>
            <p className='font-bold'>Lead Value:</p>
            <p className='font-semibold text-gray-700'>645.00</p>
          </div>
          <button onClick={toggleExpand} className='text-blue-500 underline'>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          {isExpanded && (
            <div className='my-2'>
              <p className='font-bold'>Position:</p>
              <p className='font-semibold text-gray-700'>Owner</p>

              <p className='font-bold'>Email Address:</p>
              <p className='font-semibold text-gray-700'>yash@gmail.com</p>

              <p className='font-bold'>Phone:</p>
              <p className='font-semibold text-gray-700'>9106253015</p>
            </div>
          )}
        </div>
        <div className='p-5 m-5 bg-white'>
          <p>#201 - Mahendra Tulsian</p>
          <div className='flex justify-between'>
            <p className='font-bold'>Source:</p>
            <p className='font-semibold text-gray-700'>Reference</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Last Contact:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Created:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between mb-2'>
            <p className='font-bold'>Lead Value:</p>
            <p className='font-semibold text-gray-700'>645.00</p>
          </div>
          <button onClick={toggleExpand} className='text-blue-500 underline'>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          {isExpanded && (
            <div className='my-2'>
              <p className='font-bold'>Position:</p>
              <p className='font-semibold text-gray-700'>Owner</p>

              <p className='font-bold'>Email Address:</p>
              <p className='font-semibold text-gray-700'>yash@gmail.com</p>

              <p className='font-bold'>Phone:</p>
              <p className='font-semibold text-gray-700'>9106253015</p>
            </div>
          )}
        </div>
        <div className='p-5 m-5 bg-white'>
          <p>#201 - Mahendra Tulsian</p>
          <div className='flex justify-between'>
            <p className='font-bold'>Source:</p>
            <p className='font-semibold text-gray-700'>Reference</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Last Contact:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-bold'>Created:</p>
            <p className='font-semibold text-gray-700'>9 months ago</p>
          </div>
          <div className='flex justify-between mb-2'>
            <p className='font-bold'>Lead Value:</p>
            <p className='font-semibold text-gray-700'>645.00</p>
          </div>
          <button onClick={toggleExpand} className='text-blue-500 underline'>
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          {isExpanded && (
            <div className='my-2'>
              <p className='font-bold'>Position:</p>
              <p className='font-semibold text-gray-700'>Owner</p>

              <p className='font-bold'>Email Address:</p>
              <p className='font-semibold text-gray-700'>yash@gmail.com</p>

              <p className='font-bold'>Phone:</p>
              <p className='font-semibold text-gray-700'>9106253015</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LeadsKanaban = () => {
  return (
    <div className='flex gap-5 overflow-x-auto'>
      {[...Array(10)].map((_, index) => (
        <LeadCard key={index} />
      ))}
    </div>
  );
};

export default LeadsKanaban;
