import React from "react";
import "./index.scss";

const CarouselPaginationView = ({ length, activeIndex, onClick }) => {
  return (
    <div className="carousel-page-view-container">
      {Array(length)
        .fill("")
        .map((ele, index) => (
          <div
            key={index}
            className={`bullet cursor-pointer ${
              activeIndex === index ? "filled-bullet" : ""
            }`}
            onClick={() => onClick(index)}
          />
        ))}
    </div>
  );
};

export default CarouselPaginationView;
