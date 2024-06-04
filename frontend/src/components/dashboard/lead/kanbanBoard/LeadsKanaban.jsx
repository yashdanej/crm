import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarWithDecorators, { api } from '../../../../utils/Utils';
import { kanbanLeads } from '../../../../store/slices/LeadSlices';
import CardKanban from './CardKanban';

const LeadsKanaban = () => {
  const [status, setStatus] = useState({
    oldStatus: null,
    newStatus: null,
    lead: null
  });
  const dispatch = useDispatch();

  const [snackAlert, setSnackAlert] = useState(false);
  const [snackbarProperty, setSnackbarProperty] = useState({
    text: '',
    color: ''
  });
  
  const getLeadsByStatus = () => {
    api("/lead/kanbanview", "get", false, false, true)
      .then((res) => {
        dispatch(kanbanLeads(res.data.data));
      })
      .catch((err) => {
        console.log("err in getLeadsByStatus", err);
      });
  };

  useEffect(() => {
    getLeadsByStatus();
  }, []);

  const statusData = useSelector(state => state.status.statusData);
  const leadsByStatus = useSelector(state => state.leads.leadsByStatus);

  const handleDrop = (e, statusId) => {
    e.preventDefault(); 
    if (status.oldStatus === statusId) return; // No change if same status

    api(`/lead/statuschange?currentStatus=${status.oldStatus}&newStatus=${statusId}&user=${status.lead}`, "patch", false, false, true)
      .then((res) => {
        setSnackbarProperty({
          text: res.data.message,
          color: "success"
        });
        setSnackAlert(true);
        getLeadsByStatus();
      })
      .catch((err) => {
        console.log("err in onStatusChange", err);
        setSnackbarProperty({
          text: err.toString(),
          color: "danger"
        });
        setSnackAlert(true);
      });
  };

  return (
    <div className='flex overflow-x-auto gap-7' style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
      {snackAlert && (
        <SnackbarWithDecorators
          snackAlert={snackAlert}
          setSnackAlert={setSnackAlert}
          text={snackbarProperty.text}
          color={snackbarProperty.color}
        />
      )}
      {statusData && statusData?.map((statusObj, index) => (
        <div
          key={statusObj.id}
          onDrop={(e) => handleDrop(e, statusObj.id)}
          onDragOver={(e) => e.preventDefault()}
          className='bg-slate-100 rounded-lg text-[14px]'
          style={{ minWidth: '25%' }}
        >
          <div
            className="p-3 text-white rounded-lg"
            style={{ backgroundColor: statusObj.color }}
          >
            <p>{statusObj.name} - $0.00 - {leadsByStatus[statusObj.name]?.length || 0} Leads</p>
          </div>
          <div>
            {leadsByStatus && leadsByStatus[statusObj.id]?.map((item, idx) => (
              <CardKanban status={status} setStatus={setStatus} key={idx} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsKanaban;
