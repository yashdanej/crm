import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import Tippy from "@tippyjs/react";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import TaskInfo from "./TaskInfo";
import { useDispatch, useSelector } from "react-redux";
import SnackbarWithDecorators, { changeText } from "../../utils/Utils";
import { addTaskComment, addTaskTimer, getTaskComments, getTaskTimer, updateTaskStatus } from "../../store/slices/TaskSlices";
import { useEffect } from "react";
import CommentTable from "./CommentTable";
import TimesheetTable from "./TimesheetTable";

export default function TaskModal({
  resetTaskValues,
  taskid,
  open,
  setOpen,
}) {
  const [ timeSheet, setTimeSheet ] = useState(false);
  console.log("taskid,", taskid);
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const [cOpen, setCOpen] = useState(false);

  const taskModalData = useSelector(state => state.task.modal);
  const taskCommentData = useSelector(state => state.task.comment);
  const onSubmit = () => {
    resetTaskValues();
  };
  const onCancel = () => {
    resetTaskValues();
  };
  const onStartTime = () => {
    dispatch(addTaskTimer({task_id: taskModalData?.id}));
  }
  const [comment, setComment] = useState({
    content: "",
    taskid: taskid,
    file: null
  });
  const dispatch = useDispatch();
  const onSaveComment = async () => {
    console.log("comment", comment);
    try {
      await dispatch(addTaskComment(comment)).unwrap();
      setSnackbarProperty({
        text: "Comment added successfully!",
        color: "success"
      });
    } catch (error) {
        setSnackbarProperty({
            text: error, // Display the error message
            color: "danger"
        });
    } finally {
      setSnackAlert(true);
      setComment({
        content: "",
        taskid: taskid,
        file: null
      })
    }
  }

  const handleFileInput = (e) => {
    setComment({ ...comment, file: e.target.files[0] });
  };
  const getTimer = () => {
    dispatch(getTaskTimer(taskModalData?.id));
  }

  const handleCompleted = () => {
    dispatch(updateTaskStatus({id: taskModalData?.id, status: 6}));
  }
  return (
    <React.Fragment>
      {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div>
          <div className="flex gap-5">
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 500,
                borderRadius: "md",
                boxShadow: "lg",
                p: 3,
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.body",
              }}
            >
              <div>
                <ModalClose
                  variant="plain"
                  sx={{ m: 1 }}
                  onClick={() => setOpen(false)}
                />
                <Typography
                  component="h2"
                  id="modal-title"
                  level="h4"
                  textColor="inherit"
                  fontWeight="lg"
                  mb={2}
                >
                  {taskModalData?.name}
                </Typography>
                <hr className="pt-3" />
                <div className="flex gap-4 items-center">
                  <Tippy content="Mark as completed" key={taskid}>
                    <BeenhereIcon onClick={handleCompleted} className="cursor-pointer" />
                  </Tippy>
                  <Tippy content="Timesheet" key={taskid}>
                    <MoreTimeIcon onClick={() => setTimeSheet(!timeSheet)} className="cursor-pointer" />
                  </Tippy>
                  <Tippy content="Timesheet" key={taskid}>
                    <Button
                      component="label"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      onClick={onStartTime}
                    >
                      Start Timer
                    </Button>
                  </Tippy>
                </div>
                <hr className="my-3" />
                {
                  timeSheet &&
                  <TimesheetTable getTimer={getTimer} />
                }
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="2"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your options here..."
                ></textarea>
                <hr className="mt-5" />

                <Typography
                  id="modal-desc"
                  textColor="text.secondary"
                  mb={3}
                  my={2}
                >
                  With less than a month to go before the European Union enacts
                  new consumer privacy laws for its citizens, companies around
                  the world are updating their terms of service agreements to
                  comply.
                </Typography>
                {!cOpen && (
                  <button
                    onClick={() => setCOpen(true)}
                    className="text-black mt-2 mb-4 rounded-lg"
                  >
                    Add Comment
                  </button>
                )}
                {
                  taskCommentData?.isLoading && <p>Loading...</p>
                }
                {cOpen && (
                  <>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Comment
                    </label>
                    <input
                      name="content"
                      type="text"
                      id="content"
                      onChange={(event) => setComment({...comment, content: event.target.value, taskid: taskModalData?.id})}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Comment"
                      required
                    />
                      <div className='bg-gray-50 border my-2 border-gray-300 text-gray-900 text-sm rounded-lg p-2'>
                        <label htmlFor="profile_image_input" className="cursor-pointer">
                          <input 
                            id="file"
                            type="file" 
                            multiple={false} // Set to true if you want to allow multiple files
                            onChange={handleFileInput}
                          />
                        </label>
                        {comment.file && (
                          <div>Selected File: {comment.file.name}</div>
                        )}
                      </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setCOpen(false)}
                        className="text-black px-3 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {setCOpen(false); onSaveComment()}}
                        className="text-black px-3 py-2 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}
                <CommentTable/>
              </div>
            </Sheet>
            <Sheet
              variant="outlined"
              sx={{
                minWidth: 300,
                maxWidth: 500,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
                bgcolor: "background.body",
              }}
            >
              <TaskInfo />
            </Sheet>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
