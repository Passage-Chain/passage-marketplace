import React, { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

import './index.scss';

const sideOptions = [
  {
    name: 'GENRES',
    options: [
      { id: 'action', name: 'Action', count: 210 },
      { id: 'adventure', name: 'Adventure', count: 238 },
      { id: 'card game', name: 'Card Game', count: 250 },
      { id: 'fighting', name: 'Fighting', count: 298 },
      { id: 'mmo', name: 'MMO', count: 200 },
      { id: 'music', name: 'Music', count: 213 },
      { id: 'platformer', name: 'Platformer', count: 210 },
      { id: 'puzzle', name: 'Puzzle', count: 210 },
      { id: 'racing', name: 'Racing', count: 210 },
      { id: 'RPG', name: 'RPG', count: 210 },
      { id: 'Simulation', name: 'Simulation', count: 210 },
      { id: 'Sport', name: 'Sport', count: 210 },
      { id: 'Strategy', name: 'Strategy', count: 210 },
    ]
  },
  {
    name: 'THEMES',
    options: [
      { id: 'Cartoon', name: 'Cartoon', count: 210 },
      { id: 'Fantasy', name: 'Fantasy', count: 238 },
      { id: 'Medieval', name: 'Medieval', count: 250 },
      { id: 'Military', name: 'Military', count: 298 },
      { id: 'Modern', name: 'Modern', count: 200 },
      { id: 'Pirate', name: 'Pirate', count: 213 },
      { id: 'Pixel art', name: 'Pixel art', count: 210 },
      { id: 'Sci-fi', name: 'Sci-fi', count: 210 },
      { id: 'Western', name: 'Western', count: 210 },
    ]
  }
]

function SideFilter(props) {
    //For Accordian
    const [open, setOpen] = useState('');
    const toggle = (id) => {
      if (open === id) {
        setOpen();
      } else {
        setOpen(id);
      }
    };

    return (
      <>
        {props.show ? <div className='ex-side-filter-container'>
          <Accordion open={open} toggle={toggle} stayOpen>
            {sideOptions.map((sideOption, index) => (
              <AccordionItem key={index} stayOpen>
                <AccordionHeader className='sf-header' targetId={sideOption.name}>{sideOption.name}</AccordionHeader>
                <AccordionBody accordionId={sideOption.name}>
                  {sideOption.options.map((option, i) => (
                    <div className='sf-item-wrapper' key={i} style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input className="form-check-input" type="checkbox" id={`${option.name}-box`} />
                        <span className="form-check-label" htmlFor={`${option.name}-box`}>
                            {option.name}
                        </span>
                      </div>
                      <span className='count-label'>{option.count}</span>
                    </div>
                  ))}
                </AccordionBody>
              </AccordionItem>
            ))}
          </Accordion>
        </div> : null}
      </>
    );
}

export default SideFilter;
