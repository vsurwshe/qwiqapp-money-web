import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <span><a href="/">Bills Reminder</a> &copy; 2019 124Apps.</span>
        <span className="ml-auto">Powered by <a href="http://www.124apps.com/">124Apps Pvt. Ltd.</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
