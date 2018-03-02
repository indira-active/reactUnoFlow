import React from 'react';

import classes from './index.css';

const spinner = (props) => (
    <div {...props} className={classes.Loader}>Loading...</div>
);

export default spinner;