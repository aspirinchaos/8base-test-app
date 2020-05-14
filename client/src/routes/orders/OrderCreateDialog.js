import React from 'react';
import { Form, Field, FieldArray } from '@8base/forms';
import {
  Dialog,
  Grid,
  Button,
  InputField,
  ModalContext,
  SelectField,
  DateInputField,
  Icon,
} from '@8base/boost';
import * as R from 'ramda';
import { graphql, Query } from 'react-apollo';
import { compose } from 'recompose';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const getProductOptions = (clients = []) => clients.map((item) => ({
  value: item.id,
  label: `${R.propOr('Unititled', ['name'], item)} - ${R.propOr('Free', ['price'], item)}`,
  price: item.price,
}));

const getClientOptions = (clients = []) => clients.map((item) => ({
  value: item.id,
  label: `${R.propOr('Unititled', ['firstName'], item)} ${R.propOr('Unititled', ['lastName'], item)}`,
}));

const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async (data) => {
    const products = this.props.products.productsList.items;
    data.order_Product.create = data.order_Product.create.map(p => {
      const product = products.find(x => x.id === p.product.connect.id)
      p.price = product.price;
      return p;
    })

    await this.props.orderCreate({ variables: { data } });

    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Order" onClose={this.onClose} />
      <Dialog.Body>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Query query={sharedGraphQL.CLIENTS_LIST_QUERY}>
              {({ data, loading }) => (
                <Field
                  name="client"
                  label="Client"
                  placeholder="Select a client"
                  component={SelectField}
                  loading={loading}
                  options={loading ? [] : getClientOptions(data.clientsList.items)}
                  stretch
                />
              )}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field name="address" label="Address" type="text" placeholder="Address" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDate" label="Delivery Date" withTime component={DateInputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" type="text" placeholder="Comment" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="status"
              label="Status"
              placeholder="Select a status"
              component={SelectField}
              options={[
                { label: 'Opened', value: 'Opened' },
                { label: 'Done', value: 'Done' },
              ]}
              stretch
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Body scrollable>
        <FieldArray name="order_Product">
          {(({ fields }) => (
            <Grid.Layout gap="sm" stretch>
              <Grid.Box>
                <Button
                  type={'button'}
                  color="primary"
                  onClick={() => fields.push()}
                  stretch={false}
                >
                  Add product
                </Button>
              </Grid.Box>
              {fields.map((name, index) => (
                <Grid.Box key={name}>
                  <Grid.Layout inline gap="sm" columns="20px auto 150px 20px" alignItems={'center'}>
                    <Grid.Box>
                      #{index + 1}
                    </Grid.Box>
                    <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
                      {({ data, loading }) => (
                        <Field
                          name={`${name}.product`}
                          placeholder="Select a product"
                          component={SelectField}
                          loading={loading}
                          options={loading ? [] : getProductOptions(data.productsList.items)}
                          stretch
                        />
                      )}
                    </Query>
                    <Grid.Box>
                      <Field
                        name={`${name}.quantity`}
                        type="number"
                        placeholder="Quantity"
                        component={InputField}
                      />
                    </Grid.Box>
                    <Grid.Box>
                      <Icon
                        color={'DANGER'}
                        onClick={() => fields.remove(index)}
                        name={'Trashcan'}
                      />
                    </Grid.Box>
                  </Grid.Layout>
                </Grid.Box>
              ))}
            </Grid.Layout>
          ))}
        </FieldArray>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>Cancel</Button>
        <Button color="primary" type="submit" loading={submitting}>Create Order</Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ORDER_CREATE_DIALOG_ID} size="lg">
        <Form type="CREATE" tableSchemaName="Orders" onSubmit={this.onSubmit}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
  name: 'orderCreate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfully created',
    },
  },
})(OrderCreateDialog);

OrderCreateDialog = compose(
  graphql(sharedGraphQL.CLIENTS_LIST_QUERY, { name: 'clients' }),
  graphql(sharedGraphQL.PRODUCTS_LIST_QUERY, { name: 'products' }),
)(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };
