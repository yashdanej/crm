import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarWithDecorators, { changeText } from '../../../../utils/Utils';
import { addNote, fetchNotes } from '../../../../store/slices/NoteSlices';

const Notes = () => {
  const [selected, setSelected] = useState({
    contacted: false,
    not_contacted: true,
  });
  const [note, setNote] = useState({
    rel_type: "lead",
    description: "",
    date_contacted: null
  });
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const notesData = useSelector(state => state.note.lead);
  const leadData = useSelector(state => state.leads.leadData);
  const dispatch = useDispatch();
  const resetNote = () => {
    setNote({
      rel_type: "lead",
      description: "",
      date_contacted: null
    })
  }
  const handleNoteAdd = () => {
    console.log("note", note);
    if(note.contacted){
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "Select date contacted!",
        color: "danger"
      }));
      setSnackAlert(true);
    }else if(note.description === "") {
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "Description is required!",
        color: "danger"
      }));
      setSnackAlert(true);
    }else{
      dispatch(addNote({id: leadData[0]?.id, data: note}));
      resetNote();
    }
  };

  useEffect(() => {
    dispatch(fetchNotes(leadData[0]?.id));
  }, []);

  const handleRadioChange = (contacted) => {
    setSelected({
      contacted,
      not_contacted: !contacted,
    });
    if (!contacted) {
      setNote({
        ...note,
        date_contacted: null,
      });
    }
  };

  return (
    <div className='my-3 p-10 rounded-sm w-full min:h-full max:h-[50vh] overflow-auto bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
      {
        snackAlert ?
          <SnackbarWithDecorators  snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
          : null
      }
      <table className="w-full min-w-[540px] mb-5" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Description</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date Contacted</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Date Added</th>
            </tr>
        </thead>
        <tbody>
            {
            notesData && notesData.data &&
              notesData?.data?.length > 0 && notesData?.data?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.description}</p>
                    </td>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.date_contacted?.split("T")[0]}</p>
                    </td>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.dateadded?.split("T")[0]}</p>
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
      <label htmlFor="date_contacted" className="block mb-2 text-sm font-medium my-2 text-gray-900 dark:text-white">
        <span className='text-red-600'>* </span>Description
      </label>
      <textarea
        name='description'
        value={note.description}
        onChange={(e) => { changeText(e, setNote, note); }}
        id="message"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write notes here..."
      ></textarea>
      {selected.contacted && (
        <div className='my-3'>
          <label htmlFor="date_contacted" className="block mb-2 text-sm font-medium my-2 text-gray-900 dark:text-white">
            <span className='text-red-600'>* </span>Date Contacted
          </label>
          <input
          name='date_contacted'
          value={note.date_contacted}
          onChange={(e) => { changeText(e, setNote, note); }}
          type="datetime-local"
          id="date_contacted"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        </div>
      )}
      <div className="flex items-center mb-1 mt-4">
        <input
          id="contacted-radio"
          type="radio"
          checked={selected.contacted}
          onChange={() => handleRadioChange(true)}
          name="contact"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="contacted-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I got in touch with this lead
        </label>
      </div>
      <div className="flex items-center mb-4">
        <input
          id="not-contacted-radio"
          type="radio"
          checked={selected.not_contacted}
          onChange={() => handleRadioChange(false)}
          name="contact"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="not-contacted-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I have not contacted this lead
        </label>
      </div>
      <hr />
      <div className='flex justify-end mt-4'>
        <button
          onClick={() => handleNoteAdd(leadData)}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Notes;
