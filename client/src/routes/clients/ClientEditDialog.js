import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, DateInputField, InputField, ModalContext } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

import { PhoneInputField } from 'shared/components';

const CLIENT_EDIT_DIALOG_ID = 'CLIENT_EDIT_DIALOG_ID';

class ClientEditDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = (id) => async (data) => {
    data.id = id;
    await this.props.clientUpdate({ variables: { data }});

    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Edit Client" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field name="firstName" label="First Name" type="text" placeholder="First Name" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="lastName" label="Last Name" type="text" placeholder="Last Name" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="email" label="Email" type="email" placeholder="Email" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="phone" label="Phone"  component={ PhoneInputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="birthday" label="Birthday"  component={ DateInputField } />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" loading={ submitting }>Create Client</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => {
    return (
      <Form type="UPDATE" tableSchemaName="Clients" onSubmit={ this.onSubmit(args.initialValues.id) } initialValues={ args.initialValues }>
        { this.renderFormContent }
      </Form>
    );
  };

  render() {
    console.log(this.props.initialValues);
    return (
      <Dialog id={ CLIENT_EDIT_DIALOG_ID } size="sm">
          { this.renderForm }
      </Dialog>
    );
  }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfully updated'
    },
  },
})(ClientEditDialog);

ClientEditDialog.id = CLIENT_EDIT_DIALOG_ID;

export { ClientEditDialog };
