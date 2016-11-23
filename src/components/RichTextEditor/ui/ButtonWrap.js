/* @flow */

import React from 'react';
import cx from 'classnames';
import './ButtonWrap.css';

type Props = {
  className?: string;
};

export default function ButtonWrap(props: Props) {
  let className = cx(props.className, 'buttonwrap-root');
  return <div {...props} className={className} />;
}
