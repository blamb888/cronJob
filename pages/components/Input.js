import React, { Component, createContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Styling a regular HTML input
const StyledInput = styled.input`
  display: inline-block;
  margin: 24px 8px;
  padding: 8px;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 16px;
`;

class Input extends Component {
  render() {
    return (
      <div>
        <FontAwesomeIcon icon={["fas", "tag"]} />
        <StyledInput
          value={this.props.tag}
          onChange={this.props.onChange}
          placeholder="Enter new tag name"
          />
      </div>
    );
  }
}

export default Input;
export {StyledInput};
