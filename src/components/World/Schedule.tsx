import { Popover } from 'antd';

import { ReactComponent as CalendarIcon } from '../../assets/images-v2/calendar.svg'
import "./index.scss"

//const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS = ['Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']

const ScheduleView = () => {
  return (
    <div className='schedule-view-container'>
      <span className='head-label'>Hours (EST):</span>
      <div className='days-wrapper'>
        {DAYS.map(day => (
          <div className='day-item'>
            <span className='day-name'>{day}</span>
            <span className='timings'>{ day === 'Tues' ? '1pm - 6pm' : '3pm - 6pm' }</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/*
  All the logics and functionalities like date parsing and conversion to be implemented in this component. 
 */
const Schedule = (props: any) => {
  return (
    <Popover
      placement="topRight"
      content={
        <ScheduleView />
      }
    >
      <div className='calendar-icon'><CalendarIcon /></div>
    </Popover>
  )
}

export default Schedule
