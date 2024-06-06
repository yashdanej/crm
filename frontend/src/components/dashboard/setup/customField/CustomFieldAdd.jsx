import React, { useEffect, useState } from 'react'
import { Select, Option } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { addCustomField, fetchTablesData, resetCustomField, updateCustomField } from '../../../../store/slices/SetupSlices';
import SnackbarWithDecorators, { changeText } from '../../../../utils/Utils';

const CustomFieldAdd = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const fieldData = useSelector(state => state.setup.customFields.field);
    console.log("fieldData", fieldData);
    const tablesData = useSelector(state => state.setup.customFields.tables);
    const [customField, setCustomField] = useState({
        fieldto: "",
        name: "",
        type: "",
        bs_column: null,
        default_value: "",
        options: null,
        field_order: 0,
        disalow_client_to_edit: false,
        only_admin: false,
        required: false,
        show_on_table: false,
        show_on_client_portal: false
    });
    useEffect(() => {
        if (fieldData.data) {
            setCustomField({
                fieldto: fieldData.data.fieldto,
                name: fieldData.data.name,
                type: fieldData.data.type,
                bs_column: fieldData.data.bs_column,
                default_value: fieldData.data.default_value,
                options: fieldData.data.options,
                field_order: fieldData.data.field_order,
                disalow_client_to_edit: fieldData.data.disalow_client_to_edit,
                only_admin: fieldData.data.only_admin,
                required: fieldData.data.required,
                show_on_table: fieldData.data.show_on_table,
                show_on_client_portal: fieldData.data.show_on_client_portal
            });
        }
        
    }, [fieldData]);
    useEffect(() => {
        return () => {
            console.log("Unmounted----------------------");
            dispatch(resetCustomField());
        }
    }, [])
    const resetValue = () => {
        setCustomField({
            fieldto: "",
            name: "",
            type: "",
            bs_column: null,
            default_value: "",
            options: null,
            field_order: 0,
            disalow_client_to_edit: false,
            only_admin: false,
            required: false,
            show_on_table: false,
            show_on_client_portal: false
        });
        dispatch(resetCustomField());
    }
    const dispatch = useDispatch();
    const handleCustomFieldAdd = () => {
        if(customField.fieldto && customField.name && customField.type && customField.bs_column){
            if(customField.type === "select" || customField.type === "multi_select" || customField.type === "checkbox"){
                if(!customField.options){
                    setSnackbarProperty({
                        text: "Options are required for the selected type!",
                        color: "danger"
                    });
                    setSnackAlert(true);
                    return;
                }
            }
            if(fieldData.data === null){
                dispatch(addCustomField(customField));
            }else{
                console.log("fieldData?.data?.id", fieldData?.data);
                dispatch(updateCustomField({id: fieldData?.data?.id, data: customField}));
            }
            resetValue();
            setSnackbarProperty({
                text: fieldData.data === null?"Custom field added successfully!":"Custom field updated successfully!",
                color: "success"
            });
            setSnackAlert(true);
        } else {
            setSnackbarProperty({
                text: "* fields are required!",
                color: "danger"
            });
            setSnackAlert(true);
        }
    };
    useEffect(() => {
        dispatch(fetchTablesData());
    }, []);
    useEffect(() => {
        console.log("customField", customField);
    }, [customField])
  return (
    <div className='mx-6 my-10'>
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='w-[65%] m-auto'>
            <label for="first_name" class="block mb-2 text-xl font-semibold text-slate-600">Add Custom Field</label>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='p-6'>
                    <div className='my-3'>
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Field Belongs to</label>
                        <select disabled={fieldData?.data !== null ? true : false} value={customField?.fieldto} name='fieldto' onChange={(event) => changeText(event, setCustomField, customField)} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>Nothing selected</option>
                            {
                                tablesData?.data?.map((item) => {
                                    return (
                                        <option selected={customField?.fieldto} className='uppercase' value={item.Tables_in_crmdb}>{item.Tables_in_crmdb}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className='my-3'>
                        <label class="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Field Name</label>
                        <input value={customField?.name} name='name' onChange={(event) => changeText(event, setCustomField, customField)} type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                    </div>

                    <div className='my-3'>
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Type</label>
                        <select disabled={fieldData?.data !== null ? true : false} name='type' onChange={(event) => changeText(event, setCustomField, customField)} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            <option selected={customField?.type === "input"} value="input">Input</option>
                            <option selected={customField?.type === "number"} value="number">Number</option>
                            <option selected={customField?.type === "textarea"} value="textarea">Textarea</option>
                            <option selected={customField?.type === "select"} value="select">Select</option>
                            <option selected={customField?.type === "multi_select"} value="multi_select">Multi Select</option>
                            <option selected={customField?.type === "checkbox"} value="checkbox">Checkbox</option>
                            <option selected={customField?.type === "date_picker"} value="date_picker">Date Picker</option>
                            <option selected={customField?.type === "datetime_picker"} value="datetime_picker">Datetime Picker</option>
                            <option selected={customField?.type === "color_picker"} value="color_picker">Color Picker</option>
                            <option selected={customField?.type === "hyperlink"} value="hyperlink">Hyperlink</option>
                        </select>
                    </div>
                    {
                        (customField?.type === "select" || customField?.type === "multi_select" || customField?.type === "checkbox") &&
                        <div>
                            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-500'>* </span>Options</label>
                            <textarea value={customField?.options} name="options" onChange={(event) => changeText(event, setCustomField, customField)} id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your options here..."></textarea>
                        </div>
                    }
                    <div className='my-3'>
                        <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Default Value</label>
                        <input value={customField?.default_value} name='default_value' onChange={(event) => changeText(event, setCustomField, customField)} type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                    </div>

                    <div className='my-3'>
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Order</label>
                        <input value={customField?.field_order} name='field_order' onChange={(event) => changeText(event, setCustomField, customField)} type="number" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                    </div>

                    <div class="my-2">
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Grid (Bootstrap Column eq. 12) - Max is 12</label>
                        <div className='flex'>
                            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                col-md-
                            </span>
                            <input value={customField?.bs_column} name='bs_column' onChange={(event) => changeText(event, setCustomField, customField)} type="number" id="website-admin" class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="elonmusk"/>
                        </div>
                    </div>
                    <div className='my-5'>
                        <div className='my-3'>
                            <div class="flex items-center">
                                <input checked={customField?.disalow_client_to_edit} name='disalow_client_to_edit' onChange={(event) => setCustomField({...customField, disalow_client_to_edit: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Disable Client To Edit</label>
                            </div>
                        </div>

                        <div className='my-3'>
                            <div class="flex items-center">
                                <input checked={customField?.only_admin} name='only_admin' onChange={(event) => setCustomField({...customField, only_admin: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Restrict visibility for administrators only</label>
                            </div>
                        </div>

                        <div className='my-3'>
                            <div class="flex items-center">
                                <input checked={customField?.required} name='required' onChange={(event) => setCustomField({...customField, required: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Required</label>
                            </div>
                        </div>

                        <div className='my-3'>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Visibility</label>
                            <div class="my-2 flex items-center">
                                <input checked={customField?.show_on_table} name='show_on_table' onChange={(event) => setCustomField({...customField, show_on_table: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show On Table</label>
                            </div>
                            <div class="my-2 flex items-center">
                                <input checked={customField?.show_on_client_portal} name='show_on_client_portal' onChange={(event) => setCustomField({...customField, show_on_client_portal: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show On Client Portal</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
                    <button onClick={handleCustomFieldAdd} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{fieldData.data !== null ? "Update":"Add"}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CustomFieldAdd
