import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

import axios from "axios";
import contractConfig from "../../configs/contract";
import { collections } from "../../configs/collections";
import "./index.scss";

function titleize(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function SideFilter(props) {
  const [attributes, setAttributes] = useState([]);
  const [collection, setCollection] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  //For Accordian
  const [open, setOpen] = useState("collections");
  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  useEffect(() => {
    if (collection) {
      fetchTraits();
    }
  }, [collection]);

  const fetchTraits = async () => {
    try {
      const response = await axios.get(
        `${contractConfig.NFT_API}/nfts/traits/${collection.contracts.base}`
      );

      const traits = response.data.data;
      setAttributes(traits);
    } catch (err) {
      //handleApiError(err);
    }
  };

  /* Update the payload when the filters change or when the
     singular collection changes */
  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      const payload = preparePayload();
      props.setPayload(payload);
    }
  }, [selectedFilters]);

  const preparePayload = () => {
    const payload = {};
    Object.keys(selectedFilters).forEach((option) => {
      if (selectedFilters[option].length > 0) {
        payload[option] = selectedFilters[option].join(",");
      }
    });

    return payload;
  };

  /* Only allow one collection to be selected at once (for now) */
  const handleSelections = (value, optionName) => {
    const filteredOptions = selectedFilters[optionName] || [];
    const index = filteredOptions.indexOf(value);

    if (index >= 0) {
      filteredOptions.splice(index, 1);
    } else {
      filteredOptions.push(value);
    }

    setSelectedFilters({
      ...selectedFilters,
      [optionName]: filteredOptions,
    });
  };

  const handleCollectionSelection = (collection) => {
    setCollection(collection);
    setSelectedFilters({
      //...selectedFilters,
      collectionBase: [collection.contracts.base],
      //collectionName: [collection.label]
    });
  };

  return (
    <>
      <div className="ex-side-filter-container">
        <Accordion open={open} toggle={toggle} stayOpen>
          <AccordionItem stayOpen>
            <AccordionHeader className="sf-header" targetId="collections">
              COLLECTIONS
            </AccordionHeader>
            <AccordionBody accordionId="collections">
              {!!(collections && collections.length) &&
                collections.map((c, index) => (
                  <div
                    key={index}
                    className={`sf-item-wrapper ${
                      c === collection ? "selected-collection" : ""
                    }`}
                  >
                    <span
                      key={c.id}
                      onClick={() => handleCollectionSelection(c)}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
            </AccordionBody>
          </AccordionItem>

          {collection?.label !== "MetaHuahua" &&
            attributes.map((attribute, index) => (
              <AccordionItem key={index} stayOpen>
                <AccordionHeader
                  className="sf-header"
                  targetId={attribute.type}
                >
                  {titleize(attribute.type)}
                </AccordionHeader>
                <AccordionBody accordionId={attribute.type}>
                  {attribute.values.sort().map((option, i) => (
                    <div className="sf-item-wrapper" key={i}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${option}-box`}
                        onChange={() =>
                          handleSelections(option, attribute.type)
                        }
                        checked={selectedFilters[
                          attribute.type
                        ]?.state?.includes(option)}
                      />
                      <span
                        className="form-check-label"
                        htmlFor={`${option}-box`}
                      >
                        {titleize(option)}
                      </span>
                    </div>
                  ))}
                </AccordionBody>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </>
  );
}

export default SideFilter;
