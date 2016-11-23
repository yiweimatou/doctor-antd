/* @flow */

import React from 'react';
import cx from 'classnames';

import './ButtonGroup.css';

type Props = {
  className?: string;
};

export default function ButtonGroup(props_: Props) {
  let className = cx(props_.className, 'buttongroup-root');
  return (
    <div {...props_} className={className} />
  );
}
