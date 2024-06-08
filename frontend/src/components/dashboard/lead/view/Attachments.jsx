import React, { useEffect, useRef, useState } from 'react'
import SnackbarWithDecorators, { api } from '../../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { addAttachment, fetchAttachments } from '../../../../store/slices/AttachmentSlices';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const Attachments = () => {
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const [file, setFile] = useState({
    file: null,
    rel_type: "lead"
  });
  const attachmentData = useSelector(state => state.attachment.lead);
  const leadData = useSelector(state => state.leads.leadData);
  const dispatch = useDispatch();
  const onUploadClick = () => {
    console.log("filename", file.file);
    if(file.file){
      dispatch(addAttachment({id: leadData[0]?.id, data: file}));
      setFile({
        file: null,
        rel_type: "lead"
      })
    }else{
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "Select file to attach🔴",
        color: "danger"
      }));
      setSnackAlert(true);
    }
  }
  useEffect(() => {
    dispatch(fetchAttachments(leadData[0]?.id));
  }, [])
  return (
    <div className='my-3 p-4 rounded-sm w-full min:h-full max:h-[50vh] overflow-auto bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
      {
        snackAlert ?
        <SnackbarWithDecorators  snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
        : null
      }
      <div className="flex items-center justify-center w-full">
          <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload file and store it in cloud and</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Download it</p>
              </div>
              <input onChange={(e) => setFile({...file, file: e.target.files[0]})} id="dropzone-file" type="file" className="hidden" />
          </label>
      </div>
      {
        file?.file &&
        <div className='flex mt-4'>
          <button
            onClick={() => onUploadClick()}
            type="button"
            className="w-full text-white bg-slate-900 hover:bg-slate-950 focus:ring-1 focus:ring-slate-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Upload -- {file.file.name}
          </button>
        </div>
      }
      {
        attachmentData && attachmentData.isLoading ? "Loading..." :
        attachmentData.data && attachmentData?.data?.length > 0 &&
        <table className="w-full min-w-[540px] my-5" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Name</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Type</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date Added</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Download</th>
            </tr>
        </thead>
        <tbody>
            {
              attachmentData?.data?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.file_name}</p>
                    </td>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.filetype}</p>
                    </td>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <p className="text-[13px] font-medium text-gray-400">{item?.dateadded.split("T")[0]}</p>
                    </td>
                    <td className="py-2 px-4 border-b border-b-gray-50">
                        <a className='cursor-pointer' href={item?.external_link} target="_blank" download ><ArrowCircleDownIcon/></a>
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
      }
    </div>
  )
}

export default Attachments
