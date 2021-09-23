import React, { Component, createContext, useState } from 'react';
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
  constructor(props) {
    super(props);
    this.state = {
      tag: ""
    };
    this.tagNameChange = this.tagNameChange.bind(this);
  }

  tagNameChange(e) {
    this.setState({
      tag: e.target.value
    });
  }

  componentDidUpdate(){
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <FontAwesomeIcon icon={["fas", "tag"]} />
          <StyledInput
            type="text"
            onChange={this.tagNameChange}
            {...StyledInput.value}
            placeholder="Enter new tag name"
          />
      </div>
    );
  }
}

export default Input;
