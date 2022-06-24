import React from 'react';
import PropTypes from 'prop-types';

export const Slide = (props) => {
  const { name } = props;

  return (
    <div className={`card ${name.toLowerCase()}`}>
      <h1>Hello {name}</h1>
      <div className="img-wrapper">
        <img src={require(`@/images/${name.toLowerCase()}`)} alt="" />
      </div>
    </div>
  );
};

Slide.propTypes = { name: PropTypes.string };
