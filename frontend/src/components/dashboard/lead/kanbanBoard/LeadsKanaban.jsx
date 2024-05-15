import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../../../utils/Utils';
import { kanbanLeads } from '../../../../store/slices/LeadSlices';
import CardKanban from './CardKanban';

const LeadsKanaban = () => {
  const leadsStatus = useSelector(state => state.leads.leadsByStatus);
  const dispatch = useDispatch();

  const getLeadsByStatus = () => {
    api("/lead/kanbanview", "get", false, false, true)
      .then((res) => {
        dispatch(kanbanLeads(res.data.data));
      })
      .catch((err) => {
        console.log("err in getLeadsByStatus", err);
      });
  }

  useEffect(() => {
    getLeadsByStatus();
  }, []);

  return (
    <div className='flex overflow-x-auto gap-7' style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
      {
        Object.keys(leadsStatus).map((statusKey, index) => (
            <div key={statusKey} className='bg-slate-100 rounded-lg text-[14px]' style={{ minWidth: '25%' }}>
              <div className='p-3 bg-orange-500 text-white rounded-lg'>
                <p>{statusKey} - $0.00 - {leadsStatus[statusKey].length} Leads</p>
              </div>
              <div className=''>
                {
                  leadsStatus[statusKey].map((item, index) => (
                    <CardKanban key={index} item={item} />
                  ))
                }
              </div>
            </div>
        ))
      }
    </div>
  );
};

export default LeadsKanaban;
