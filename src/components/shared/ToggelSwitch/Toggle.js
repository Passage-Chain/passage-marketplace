import { useState } from 'react';
import "./ToggleSwitch.css";

export const Toggle = ({ label, toggled, onClick }) => {
    const [isToggled, toggle] = useState(toggled)

    const callback = () => {
        toggle(!isToggled)
        onClick(!isToggled)
    }

    return (
        <label className='toggleLable'>
            <input className='toggleInput' type="checkbox" defaultChecked={isToggled} onClick={callback} />
            <span className='toggleSpan'/>
            <strong className='toggleStrong'>{label}</strong>
        </label>
    )
}