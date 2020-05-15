import React from 'react';
import * as R from 'ramda';
import { Table } from '@8base/boost';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import * as sharedGraphQL from 'shared/graphql';

let OrderProducts = ({ products }) => {

  const calcSum = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Table>
      <Table.Header columns="repeat(5, 1fr)">
        <Table.HeaderCell>Picture</Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Quantity</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
        <Table.HeaderCell>Total</Table.HeaderCell>
      </Table.Header>

      <Table.Body loading={products.loading} data={R.pathOr([], ['orders_ProductsList', 'items'], products)}>
        {(product) => (
          <Table.BodyRow columns="repeat(5, 1fr)" key={product.id}>
            <Table.BodyCell>
              {R.pathOr(false, ['product', 'picture']) && (
                <img src={R.pathOr('Unititled', ['product', 'picture', 'downloadUrl'], product)} alt="" style={{
                  width: '5rem',
                  height: '5rem',
                }} />
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {R.pathOr('Unititled', ['product', 'name'], product)}
            </Table.BodyCell>
            <Table.BodyCell>
              {product.quantity}
            </Table.BodyCell>
            <Table.BodyCell>
              {product.price}
            </Table.BodyCell>
            <Table.BodyCell>
              {product.quantity * product.price}
            </Table.BodyCell>
          </Table.BodyRow>
        )}
      </Table.Body>
      <Table.Footer columns="5fr">
        <Table.BodyCell>
          Order Total: {calcSum(R.pathOr([], ['orders_ProductsList', 'items'], products))}
        </Table.BodyCell>
      </Table.Footer>
    </Table>
  );
};

OrderProducts = graphql(
  sharedGraphQL.ORDER_PRODUCTS_LIST_QUERY,
  {
    name: 'products',
    options: (props) => ({
      variables: {
        id: props.id,
      },
    }),
  },
)(OrderProducts);

OrderProducts.propTypes = {
  id: PropTypes.string,
}

export { OrderProducts };
