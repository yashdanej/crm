import React from 'react'
import { useSelector } from 'react-redux';
import { displayTimeOfPost, selectedItem } from '../../../../utils/Utils';
import { Chip, Stack } from '@mui/material';

const Profile = ({lead, leadData, ConvertToCustomer}) => {
    const typeOfWorkData = useSelector(state => state.setup.typeOfWork);
    const profileOfClientData = useSelector(state => state.setup.profileOfClient);
    const assignedDatas = useSelector(state => state.assigned.assignedData);
    const statusData = useSelector((state) => state.status.statusData);
    const sourceData = useSelector((state) => state.source.sourceData);
    const assignedData = useSelector((state) => state.assigned.assignedData);
  return (
    <>
    <div className='flex justify-between my-4'>
    <div className='w-[25%]'>
        <p className='bg-slate-200 font-semibold my-2'>Lead Information</p>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Name</p>
        <p className='text-[14px]'>{lead?.name}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Type Of Work</p>
        <p className='text-[14px]'>{typeOfWorkData?.find(option => option.id == lead?.typeofwork)?.name}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Profile Of Client</p>
        <p className='text-[14px]'>{profileOfClientData?.find(option => option.id == lead?.profileofclient)?.name}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Email Address</p>
        <p className='text-[14px]'>{lead?.email}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Website</p>
        <p className='text-[14px]'>{lead?.website}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Name</p>
        <p className='text-[14px]'>{lead?.phonenumber}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Lead value</p>
        <p className='text-[14px]'>{lead?.lead_value}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Company</p>
        <p className='text-[14px]'>{lead?.company}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Address</p>
        <p className='text-[14px]'>{lead?.address}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>City</p>
        <p className='text-[14px]'>{lead?.city}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>State</p>
        <p className='text-[14px]'>{lead?.state}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Country</p>
        <p className='text-[14px]'>{lead?.country}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Zip Code</p>
        <p className='text-[14px]'>{lead?.zip}</p>
        </div>
        
    </div>
    <div className='w-[25%]'>
        <p className='bg-slate-200 font-semibold my-2'>General Information</p>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Status</p>
        <p className='text-[14px]'>{selectedItem(leadData[0], statusData, "Status")}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Source</p>
        <p className='text-[14px]'>{selectedItem(leadData[0], sourceData, "Source")}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Default Language</p>
        <p className='text-[14px]'>{lead?.default_language}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Assigned</p>
        <p className='text-[14px]'>{selectedItem(leadData[0], assignedData, "Assigned")}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Tags</p>
        <p className='text-[14px]'>
            {
            leadData[0]?.tags &&
            <Stack direction="row" spacing={1}>
            {leadData[0]?.tags.split(",").map((tag) => {
                return (
                        <Chip label={tag} variant="outlined" />
                    )
                })
            }
            </Stack>
            }
        </p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Created</p>
        <p className='text-[14px]'>{displayTimeOfPost(leadData[0]?.dateadded)}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Last Contacted</p>
        <p className='text-[14px]'>{displayTimeOfPost(leadData[0]?.lastcontact)}</p>
        </div>
        <div className='my-1'>
        <p className='text-[14px] text-slate-800 font-bold'>Public</p>
        <p className='text-[14px]'>{leadData[0]?.is_public}</p>
        </div>
    </div>
    <div>
    </div>
    </div>
    <div className='my-1'>
    <p className='text-[14px] text-slate-800 font-bold'>Description</p>
    <p className='text-[14px]'>{lead?.description}</p>
    </div>
    <div className='my-1'>
    <p className='bg-slate-200 font-semibold my-3'>Latest Activity</p>
    <div className='flex justify-between'>
        <p className='text-[14px]'><span className='font-bold'>{assignedDatas.find(option => option.id == leadData[0]?.addedfrom)?.full_name}</span> - {assignedDatas.find(option => option.id == leadData[0]?.addedfrom)?.full_name} assigned to {assignedDatas.find(option => option.id == leadData[0]?.assigned)?.full_name}</p>
        <button onClick={() => ConvertToCustomer(leadData[0]?.id)} className='p-4 px-8 bg-blue-700 text-white font-bold rounded-xl pointer'>Convert To Customer</button>
    </div>
    </div>
    </>
  )
}

export default Profile
