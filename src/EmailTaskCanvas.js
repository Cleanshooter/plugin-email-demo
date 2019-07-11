/** @jsx jsx */
import React from 'react';
import { Global, jsx, css } from '@emotion/core';
import axios from 'axios';
import _ from 'lodash';
import Root from "react-shade";
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { IconContext } from 'react-icons';
import { MdSend } from 'react-icons/md';

const iconContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

export default class EmailTaskCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: ''
    }

    this.updateResponse = this.updateResponse.bind(this);
    this.respond = this.respond.bind(this);
  }

  updateResponse(value) {
    this.setState({ response: value });
  }

  respond() {
    // Call create{type} API
    console.log(`Sending: ${this.state.response}`);
    
    const self = this;
    const { task, manager } = this.props;
    const { response } = this.state;
    console.log('Task', task);
    console.log('Manager', manager);

    // const url = 'http://localhost/sendgrid/send' // use for local testing
    const url = 'https://mail-server.joemotacek.com/sendgrid/send'; // replace with your server

    axios.post(url,
      { to: _.get(task, 'attributes.from'),
        from: 'no-reply@demo.com',
        subject: `RE: ${_.get(task, 'attributes.subject')}`,
        html: response,
      },
      {
        headers: {
          'Authorization': `Bearer ${_.get(manager, 'user.token', '')}`,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then(() => {
        console.log('Message Sent');
        self.setState({response: ''});
      })
      .catch(err => console.error(err)); // eslint-disable-line
  }

  render() {
    const message = _.get(this, 'props.task.attributes.message', '');
    const { response } = this.state;
    // console.log(this.props);
    return (
      <div
        id="emailTab"
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <Global
          styles={css`
            .ck-editor__editable {
              width: 100%;
              background-color:rgba(128, 128, 128, 0.25);
            }
          `}
        />
        <div
          css={css`
            height: 100%;
            overflow: auto;
            padding: 10px;
          `}
        >
          <Root>
            <div>
              <div
                dangerouslySetInnerHTML={{ __html: message }} // eslint-disable-line react/no-danger
              />
            </div>
          </Root>
        </div>
        <div
          css={css`
            padding: 5px;
            display: flex;
            justifyContent: center;
            display: flex;
            margin-left: 12px;
            margin-right: 12px;
            border-style: solid;
            border-width: 1px 0px 0px 0px;
            border-color: rgb(96, 100, 113);
          `}
        >
          <CKEditor
            editor={ InlineEditor }
            data={ response }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                // console.log( { event, editor, data } );
                this.updateResponse(data);
            } }
          />
          <button
            css={css`
              margin-left: 4px;
              margin-right: 4px;
              width: 28px;
              height: 28px;
              align-self: center;
              color: rgb(255, 255, 255);
              padding: 0px;
              border-width: initial;
              border-style: none;
              border-color: initial;
              border-image: initial;
              background: rgb(25, 118, 210);
              outline: none;
              border-radius: 100px;
            `}
            type="button"
            onClick={() => this.respond()}
          >
            <IconContext.Provider value={{ style: { fontSize: '1.5em' } }}>
              <div style={iconContainer}>
                <MdSend />
              </div>
            </IconContext.Provider>
          </button>
        </div>
      </div>
    );
  }
}
