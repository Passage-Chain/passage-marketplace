import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReportUserModal from './ReportUserModal';
import accountService from "../../services/account";
import { setAccused, setOnSuccess, setShowReportUserModal  } from '../../redux/reportSlice'
import Toast from '../custom/CustomToast';
import './index.scss'

const Report = () => {
  const [cause, setCause] = useState('')
  const [description, setDescription] = useState('')
  const { showReportModal, accused, onSuccess } = useSelector(state => state.report)

  const dispatch = useDispatch()

  const handleCloseReportModal = () => {
    dispatch(setShowReportUserModal(false))
  }

  const handleReportUser = async () => {
    const payload = {
      accused: accused?.friendId,
      cause,
      description,
      eventId: ''
    }

    try {
      const response = await accountService.addReport(payload)
      handleCloseReportModal()
      dispatch(setAccused(undefined))
      onSuccess && onSuccess()
      dispatch(setOnSuccess(undefined))
      setDescription('')
      setCause(undefined)
      Toast.success('User reported', 'The user has been reported!')
    } catch (error) {
      console.error(error)
      Toast.error('Error', 'Something went wrong, please try again!')
    }
  }

  return (
    <div className='report-user-container'>
      <ReportUserModal 
        showModal={showReportModal} 
        handleClose={handleCloseReportModal}
        handleSubmit={handleReportUser}
        handleCauseChange={setCause}
        handleDescriptionChange={setDescription}
        cause={cause}
        description={description}
      />
    </div>
  )
}

export default Report